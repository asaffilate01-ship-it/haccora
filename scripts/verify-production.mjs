import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const failures = [];
const required = [
  ".env.example",
  "public/manifest.webmanifest",
  "public/sw.js",
  "supabase/migrations/20260801090000_production_tenancy_security.sql",
  "supabase/functions/contact/index.ts",
  "supabase/functions/inspection-export/index.ts",
  "supabase/functions/inspector-invite/index.ts",
  "supabase/functions/notification-dispatch/index.ts",
  "supabase/functions/sensor-ingest/index.ts",
  "supabase/functions/sensor-provision/index.ts",
  "supabase/functions/team-invite/index.ts",
  "mobile/app.json",
  "mobile/eas.json",
  ".github/workflows/ci.yml",
  "docs/PRODUCTION_READINESS.md",
];

for (const file of required) {
  try {
    await stat(path.join(root, file));
  } catch {
    failures.push(`Missing required production file: ${file}`);
  }
}

const auth = await readFile(path.join(root, "src/lib/auth.tsx"), "utf8");
if (/data:\s*\{[^}]*\brole\b/s.test(auth))
  failures.push("Public sign-up still sends role metadata");

const login = await readFile(path.join(root, "src/routes/login.tsx"), "utf8");
if (/setRole\(|onClick=\{\(\) => setRole/.test(login))
  failures.push("Public sign-up still exposes a role selector");

const migration = await readFile(
  path.join(root, "supabase/migrations/20260801090000_production_tenancy_security.sql"),
  "utf8",
);
for (const marker of [
  "organization_memberships",
  "inspector_access_grants",
  "audit_events",
  "can_read_organization",
  "NEW.reading",
  "docs_insert_scoped",
]) {
  if (!migration.includes(marker)) failures.push(`Security migration is missing: ${marker}`);
}

const trackedEnvCandidates = (await readdir(root)).filter(
  (name) => name === ".env" || /^\.env\.(?!example$)/.test(name),
);
if (trackedEnvCandidates.length)
  failures.push(
    `Local environment file present in project root: ${trackedEnvCandidates.join(", ")}`,
  );

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}
console.log("Production structure verification passed.");
