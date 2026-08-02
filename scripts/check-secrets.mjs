import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const findings = [];
const ignoredDirectories = new Set([
  ".git",
  ".nitro",
  ".output",
  ".tanstack",
  ".vinxi",
  ".wrangler",
  "dist",
  "node_modules",
]);
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

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    const relative = path.relative(root, absolute).replaceAll(path.sep, "/");
    if (entry.isDirectory()) {
      await walk(absolute);
      continue;
    }
    if (!entry.isFile()) continue;
    if (
      (entry.name === ".env" || /^\.env\.(?!example$)/.test(entry.name)) &&
      relative !== ".env.example" &&
      relative !== "mobile/.env.example"
    ) {
      findings.push(`${relative}: environment file must not be committed`);
      continue;
    }
    if (!textExtensions.has(path.extname(entry.name)) && !entry.name.startsWith(".env")) {
      continue;
    }
    if ((await stat(absolute)).size > 1024 * 1024) continue;
    const content = await readFile(absolute, "utf8");
    if (relative.endsWith(".env.example")) continue;
    for (const [label, pattern] of secretPatterns) {
      if (pattern.test(content)) findings.push(`${relative}: possible ${label}`);
    }
  }
}

await walk(root);
if (findings.length) {
  console.error(findings.map((finding) => `- ${finding}`).join("\n"));
  process.exit(1);
}
console.log("Repository secret-pattern scan passed.");
