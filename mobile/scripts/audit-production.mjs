import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const policyFile = path.join(root, "security/dependency-audit-exceptions.json");

function advisoryId(url) {
  return (
    String(url ?? "")
      .match(/GHSA-[a-z0-9-]+/i)?.[0]
      ?.toUpperCase() ?? null
  );
}

function directAdvisories(report) {
  const found = [];
  for (const vulnerability of Object.values(report.vulnerabilities ?? {})) {
    for (const via of vulnerability.via ?? []) {
      if (typeof via === "object" && via !== null) {
        const advisory = advisoryId(via.url);
        if (advisory) {
          found.push({
            advisory,
            package: via.name,
            severity: via.severity,
          });
        }
      }
    }
  }
  return [...new Map(found.map((item) => [`${item.package}:${item.advisory}`, item])).values()];
}

function leafAdvisories(report, packageName, seen = new Set()) {
  if (seen.has(packageName)) return new Set();
  const nextSeen = new Set(seen).add(packageName);
  const vulnerability = report.vulnerabilities?.[packageName];
  const leaves = new Set();

  for (const via of vulnerability?.via ?? []) {
    if (typeof via === "string") {
      for (const advisory of leafAdvisories(report, via, nextSeen)) {
        leaves.add(advisory);
      }
    } else if (via && typeof via === "object") {
      const advisory = advisoryId(via.url);
      if (advisory) leaves.add(advisory);
    }
  }
  return leaves;
}

export function evaluateAudit(report, policy, today = new Date()) {
  if (
    !report ||
    report.error ||
    !report.vulnerabilities ||
    typeof report.vulnerabilities !== "object"
  ) {
    return {
      passed: false,
      exceptions: [],
      uncoveredDirect: [],
      unexplainedChains: ["invalid_audit_report"],
      expired: [],
    };
  }

  const vulnerabilityNames = Object.keys(report.vulnerabilities);
  if (!vulnerabilityNames.length) {
    return {
      passed: true,
      exceptions: [],
      uncoveredDirect: [],
      unexplainedChains: [],
      expired: [],
    };
  }

  const date = today.toISOString().slice(0, 10);
  const active = new Map(
    (policy.exceptions ?? [])
      .filter((item) => item.expiresOn >= date)
      .map((item) => [`${item.package}:${item.advisory.toUpperCase()}`, item]),
  );

  const direct = directAdvisories(report);
  const uncoveredDirect = direct.filter((item) => {
    if (!["high", "critical"].includes(item.severity)) return false;
    if (item.severity === "critical") return true;
    const exception = active.get(`${item.package}:${item.advisory}`);
    return !exception || exception.severity !== item.severity;
  });

  const directIds = new Set(direct.map((item) => item.advisory));
  const unexplainedChains = vulnerabilityNames.filter((name) => {
    const leaves = leafAdvisories(report, name);
    return !leaves.size || [...leaves].some((advisory) => !directIds.has(advisory));
  });

  const directKeys = new Set(direct.map((item) => `${item.package}:${item.advisory}`));
  const expired = (policy.exceptions ?? []).filter(
    (item) =>
      item.expiresOn < date &&
      directKeys.has(`${item.package}:${item.advisory.toUpperCase()}`),
  );

  return {
    passed: uncoveredDirect.length === 0 && unexplainedChains.length === 0 && expired.length === 0,
    exceptions: direct.filter((item) => active.has(`${item.package}:${item.advisory}`)),
    uncoveredDirect,
    unexplainedChains,
    expired,
  };
}

function readAudit() {
  try {
    return execFileSync("npm", ["audit", "--omit=dev", "--json"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    if (typeof error.stdout === "string" && error.stdout.trim()) {
      return error.stdout;
    }
    throw error;
  }
}

function main() {
  const report = JSON.parse(readAudit());
  const policy = JSON.parse(readFileSync(policyFile, "utf8"));
  const result = evaluateAudit(report, policy);

  if (!result.passed) {
    console.error(
      JSON.stringify(
        {
          vulnerabilities: report.metadata?.vulnerabilities,
          uncoveredDirect: result.uncoveredDirect,
          unexplainedChains: result.unexplainedChains,
          expired: result.expired.map((item) => `${item.package}:${item.advisory}`),
        },
        null,
        2,
      ),
    );
    process.exit(1);
  }

  if (result.exceptions.length) {
    console.warn(
      `::warning::Mobile audit passed with ${result.exceptions.length} exact temporary build-tool exception(s); all expire by 2026-10-18.`,
    );
  }
  console.log("Mobile production dependency audit passed; no unapproved high/critical findings.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
