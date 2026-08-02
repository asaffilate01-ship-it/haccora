import { execFile } from "node:child_process";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const root = process.cwd();
const findings = [];
const allowedEnvironmentFiles = new Set([".env.example", "mobile/.env.example"]);
const textExtensions = new Set([
  ".env",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".sql",
  ".toml",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml",
]);
const secretPatterns = [
  ["private key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ["GitHub token", /\b(?:ghp|github_pat)_[A-Za-z0-9_]{30,}\b/],
  ["AWS access key", /\bAKIA[0-9A-Z]{16}\b/],
  ["Stripe secret key", /\bsk_(?:live|test)_[A-Za-z0-9]{20,}\b/],
  ["Stripe webhook secret", /\bwhsec_[A-Za-z0-9]{20,}\b/],
  [
    "Supabase service role key",
    /SUPABASE_SERVICE_ROLE_KEY\s*=\s*["']?(?:eyJ[A-Za-z0-9_-]{40,}|sb_secret_[A-Za-z0-9_-]{20,})/,
  ],
];

const { stdout } = await run("git", ["ls-files", "-z"], {
  cwd: root,
  encoding: "utf8",
  maxBuffer: 10 * 1024 * 1024,
});
const trackedFiles = stdout.split("\0").filter(Boolean);

for (const relative of trackedFiles) {
  const name = path.basename(relative);
  if (
    (name === ".env" || /^\.env\.(?!example$)/.test(name)) &&
    !allowedEnvironmentFiles.has(relative)
  ) {
    findings.push(`${relative}: environment file must not be committed`);
    continue;
  }

  if (!textExtensions.has(path.extname(name)) && !name.startsWith(".env")) continue;
  const absolute = path.join(root, relative);
  if ((await stat(absolute)).size > 1024 * 1024) continue;
  const content = await readFile(absolute, "utf8");
  if (allowedEnvironmentFiles.has(relative)) continue;
  for (const [label, pattern] of secretPatterns) {
    if (pattern.test(content)) findings.push(`${relative}: possible ${label}`);
  }
}

if (findings.length) {
  console.error(findings.map((finding) => `- ${finding}`).join("\n"));
  process.exit(1);
}
console.log(`Tracked-file secret scan passed (${trackedFiles.length} files).`);
