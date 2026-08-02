import { execFile } from "node:child_process";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const root = process.cwd();
const failures = [];
const run = promisify(execFile);
const required = [
  ".env.example",
  "package-lock.json",
  "mobile/package-lock.json",
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
  "supabase/functions/privacy-requests/index.ts",
  "supabase/functions/security-center/index.ts",
  "supabase/functions/file-scan/index.ts",
  "supabase/migrations/20260802090000_v2_security_privacy_launch.sql",
  "src/routes/app.security.tsx",
  "supabase/functions/operations-dispatch/index.ts",
  "supabase/migrations/20260802100000_v2_operations_control.sql",
  "src/routes/app.control-centre.tsx",
  "src/routes/app.workflows.tsx",
  "supabase/migrations/20260802103319_63102a85-216e-4527-ab82-2f9dc19862bb.sql",
  "supabase/migrations/20260802120000_v2_commercial_reconciliation.sql",
  "supabase/functions/billing/index.ts",
  "supabase/functions/integration-admin/index.ts",
  "supabase/functions/integration-dispatch/index.ts",
  "supabase/functions/package-lock.json",
  "supabase/functions/package.json",
  "src/routes/app.billing.tsx",
  "src/routes/app.integrations.tsx",
  "src/routes/app.preferences.tsx",
  "mobile/app/actions.tsx",
  "mobile/app/documents.tsx",
  "mobile/app/incidents.tsx",
  "mobile/app/settings.tsx",
  "mobile/app.json",
  "mobile/eas.json",
  ".github/workflows/ci.yml",
  ".github/workflows/codeql.yml",
  "scripts/check-migration-lineage.mjs",
  "scripts/check-secrets.mjs",
  "scripts/verify-launch-env.mjs",
  "playwright.config.ts",
  "tests/e2e/public-accessibility.spec.ts",
  "src/routes/health[.]json.ts",
  ".github/workflows/database.yml",
  "supabase/tests/database/rls_isolation.test.sql",
  "docs/PRODUCTION_READINESS.md",
  "docs/MIGRATION_RECONCILIATION.md",
  "docs/V2_FILE_3_COMPLETE.md",
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

const envExample = await readFile(path.join(root, ".env.example"), "utf8");
for (const key of [
  "MALWARE_SCAN_URL",
  "MALWARE_SCAN_TOKEN",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRICE_PRO",
  "STRIPE_LIVE_MODE",
  "INTEGRATION_ENCRYPTION_KEY",
]) {
  if (!new RegExp(`^${key}=`, "m").test(envExample)) {
    failures.push(`Environment template is missing: ${key}`);
  }
}

const supabaseConfig = await readFile(path.join(root, "supabase/config.toml"), "utf8");
for (const functionName of [
  "file-scan",
  "operations-dispatch",
  "billing",
  "integration-admin",
  "integration-dispatch",
]) {
  if (!supabaseConfig.includes(`[functions.${functionName}]`)) {
    failures.push(`Supabase config is missing function: ${functionName}`);
  }
}

const ci = await readFile(path.join(root, ".github/workflows/ci.yml"), "utf8");
for (const functionName of [
  "privacy-requests",
  "security-center",
  "file-scan",
  "operations-dispatch",
  "billing",
  "integration-admin",
  "integration-dispatch",
]) {
  if (!ci.includes(`${functionName}/index.ts`)) {
    failures.push(`CI does not type-check Edge Function: ${functionName}`);
  }
}

const operationsMigration = await readFile(
  path.join(root, "supabase/migrations/20260802100000_v2_operations_control.sql"),
  "utf8",
);
for (const marker of [
  "workflow_template_versions",
  "workflow_step_results",
  "unified_inbox_items",
  "sensor_health_snapshots",
  "traceability_edges",
  "transition_corrective_action",
  "dispatch_operations_control",
]) {
  if (!operationsMigration.includes(marker)) {
    failures.push(`V2 operations migration is missing: ${marker}`);
  }
}

const securityMigration = await readFile(
  path.join(root, "supabase/migrations/20260802090000_v2_security_privacy_launch.sql"),
  "utf8",
);
for (const marker of [
  "privacy_requests",
  "device_sessions",
  "security_events",
  "high_risk_action_requests",
  "file_scan_jobs",
  "two-person approval required",
]) {
  if (!securityMigration.includes(marker)) {
    failures.push(`V2 security migration is missing: ${marker}`);
  }
}

const completeMigration = await readFile(
  path.join(root, "supabase/migrations/20260802103319_63102a85-216e-4527-ab82-2f9dc19862bb.sql"),
  "utf8",
);
for (const marker of [
  "subscription_entitlements",
  "billing_events",
  "webhook_endpoints",
  "encrypted_signing_secret",
  "claim_webhook_deliveries",
  "user_experience_preferences",
  "sync_conflicts",
]) {
  if (!completeMigration.includes(marker)) {
    failures.push(`V2 complete migration is missing: ${marker}`);
  }
}

const { stdout: trackedOutput } = await run("git", ["ls-files", "-z"], {
  cwd: root,
  encoding: "utf8",
});
const trackedEnvironmentFiles = trackedOutput
  .split("\0")
  .filter(Boolean)
  .filter(
    (file) =>
      /(^|\/)\.env($|\.)/.test(file) && file !== ".env.example" && file !== "mobile/.env.example",
  );
if (trackedEnvironmentFiles.length) {
  failures.push(`Tracked environment file: ${trackedEnvironmentFiles.join(", ")}`);
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}
console.log("Production structure verification passed.");
