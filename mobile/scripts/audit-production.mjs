import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const ALLOW_UNTIL = new Date("2026-10-01T00:00:00Z");
const ALLOWED_ADVISORIES = new Set([
  "https://github.com/advisories/GHSA-w3rx-r6r6-pgpr",
  "https://github.com/advisories/GHSA-5p2g-fcmc-qvqq",
]);
const ALLOWED_CHAIN = new Set(["image-size", "metro", "metro-config", "metro-transform-worker"]);

export function evaluateAudit(report, now = new Date()) {
  const failures = [];
  const allowed = [];

  for (const [name, vulnerability] of Object.entries(report?.vulnerabilities ?? {})) {
    if (!["high", "critical"].includes(vulnerability.severity)) continue;
    if (vulnerability.severity === "critical" || !ALLOWED_CHAIN.has(name)) {
      failures.push(`${name}: unapproved ${vulnerability.severity} vulnerability`);
      continue;
    }

    const directAdvisories = (vulnerability.via ?? []).filter(
      (item) => typeof item === "object" && item !== null,
    );
    const transitiveLinks = (vulnerability.via ?? []).filter((item) => typeof item === "string");
    const hasUnknownAdvisory = directAdvisories.some(
      (item) => item.severity === "high" && !ALLOWED_ADVISORIES.has(item.url),
    );
    const hasUnknownLink = transitiveLinks.some((item) => !ALLOWED_CHAIN.has(item));

    if (
      hasUnknownAdvisory ||
      hasUnknownLink ||
      (name === "image-size" && !directAdvisories.length)
    ) {
      failures.push(`${name}: high-severity path is outside the temporary Metro allowlist`);
      continue;
    }
    if (now >= ALLOW_UNTIL) {
      failures.push(`${name}: temporary Metro advisory allowlist expired on 2026-10-01`);
      continue;
    }
    allowed.push(name);
  }

  return { allowed, failures };
}

function readAudit() {
  try {
    return execFileSync("npm", ["audit", "--omit=dev", "--json"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    if (typeof error.stdout === "string" && error.stdout.trim()) return error.stdout;
    throw error;
  }
}

function main() {
  const report = JSON.parse(readAudit());
  const result = evaluateAudit(report);
  if (result.failures.length) {
    console.error(result.failures.map((failure) => `- ${failure}`).join("\n"));
    process.exit(1);
  }
  if (result.allowed.length) {
    console.warn(
      `::warning::Temporarily allowing the repository-controlled Metro build-time image-size advisories for ${result.allowed.join(", ")}; expires 2026-10-01.`,
    );
  }
  console.log("Mobile production dependency audit passed; no unapproved high/critical findings.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
