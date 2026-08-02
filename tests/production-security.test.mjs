import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("signup metadata cannot request a privileged role", async () => {
  const source = await readFile("src/lib/auth.tsx", "utf8");
  assert.doesNotMatch(source, /data:\s*\{[^}]*\brole\b/s);
});

test("temperature trigger evaluates the persisted reading column", async () => {
  const migration = await readFile(
    "supabase/migrations/20260801090000_production_tenancy_security.sql",
    "utf8",
  );
  assert.match(migration, /NEW\.reading/);
  assert.doesNotMatch(migration.slice(migration.indexOf("tg_temp_alert")), /NEW\.value_c/);
});

test("documents are private and use tenant plus user storage prefixes", async () => {
  const migration = await readFile(
    "supabase/migrations/20260801090000_production_tenancy_security.sql",
    "utf8",
  );
  assert.match(migration, /'documents', 'documents', false/);
  assert.match(migration, /docs_insert_scoped/);
  assert.match(migration, /\[1\].*current_organization_id/s);
  assert.match(migration, /\[2\].*auth\.uid/s);
  assert.match(migration, /document\.storage_path = name/);
  assert.match(
    migration,
    /has_valid_inspector_grant\(\s*document\.organization_id, 'documents', document\.location_id/s,
  );
});

test("native client queues idempotent offline writes", async () => {
  const queue = await readFile("mobile/lib/offline-queue.ts", "utf8");
  const temperature = await readFile("mobile/app/temperature.tsx", "utf8");
  assert.match(queue, /idempotency_key/);
  assert.match(queue, /NetInfo\.fetch/);
  assert.match(queue, /SecureStore\.setItemAsync/);
  assert.doesNotMatch(queue, /attempts\s*<\s*\d+/);
  assert.match(temperature, /organization_id: organizationId/);
});

test("tenant location references use composite integrity", async () => {
  const migration = await readFile(
    "supabase/migrations/20260801090000_production_tenancy_security.sql",
    "utf8",
  );
  assert.match(migration, /FOREIGN KEY \(location_id, organization_id\)/);
  assert.match(migration, /REFERENCES public\.locations\(id, organization_id\)/);
});

test("staff writes are attributed to the authenticated actor", async () => {
  const migration = await readFile(
    "supabase/migrations/20260801090000_production_tenancy_security.sql",
    "utf8",
  );
  assert.match(migration, /can_operate_record/);
  assert.match(migration, /p_actor_id = auth\.uid\(\)/);
});

test("inspection access is invited, scoped and expiring", async () => {
  const migration = await readFile(
    "supabase/migrations/20260801090000_production_tenancy_security.sql",
    "utf8",
  );
  assert.match(migration, /accept_inspector_invitation/);
  assert.match(migration, /evidence_scopes/);
  assert.match(migration, /now\(\) BETWEEN g\.valid_from AND g\.valid_until/);
  assert.match(migration, /GRANT UPDATE \(revoked_at\) ON public\.inspector_access_grants/);
});

test("inspector navigation follows the granted evidence scopes", async () => {
  const source = await readFile("src/lib/auth.tsx", "utf8");
  assert.match(source, /INSPECTOR_SCOPE_BY_NAV/);
  assert.match(source, /inspectorScopes\.includes\(requiredScope\)/);
  assert.doesNotMatch(source.slice(source.indexOf("inspector:")), /"health"/);
});

test("raw audit payloads are limited to managers and the actor", async () => {
  const migration = await readFile(
    "supabase/migrations/20260801090000_production_tenancy_security.sql",
    "utf8",
  );
  const policy = migration.slice(migration.indexOf("CREATE POLICY audit_events_read"));
  assert.match(policy, /actor_id = auth\.uid\(\)/);
  assert.match(policy, /can_manage_organization\(organization_id\)/);
  assert.doesNotMatch(policy.slice(0, policy.indexOf("CREATE INDEX")), /has_valid_inspector_grant/);
});

test("an organization cannot lose its last active owner", async () => {
  const migration = await readFile(
    "supabase/migrations/20260801090000_production_tenancy_security.sql",
    "utf8",
  );
  assert.match(migration, /tg_preserve_active_owner/);
  assert.match(migration, /organization must retain an active owner/);
});

test("sensor ingestion bounds timestamps and normalizes Fahrenheit", async () => {
  const source = await readFile("supabase/functions/sensor-ingest/index.ts", "utf8");
  assert.match(source, /captured_at_out_of_range/);
  assert.match(source, /body\.unit === "fahrenheit"/);
  assert.match(source, /celsiusReading/);
});

test("sensor secrets cannot be changed through the client role", async () => {
  const migration = await readFile(
    "supabase/migrations/20260801090000_production_tenancy_security.sql",
    "utf8",
  );
  assert.match(migration, /REVOKE UPDATE ON public\.sensor_devices FROM authenticated/);
  assert.doesNotMatch(migration, /GRANT UPDATE \([^)]*secret_hash[^)]*\)/);
});

test("service worker never caches authenticated routes", async () => {
  const worker = await readFile("public/sw.js", "utf8");
  assert.match(worker, /sensitiveRoute/);
  assert.match(worker, /url\.pathname\.startsWith\("\/app"\)/);
  assert.doesNotMatch(worker, /const SHELL = \[[^\]]*"\/login"/s);
});

test("v2 security events are immutable and tenant scoped", async () => {
  const migration = await readFile(
    "supabase/migrations/20260802090000_v2_security_privacy_launch.sql",
    "utf8",
  );
  assert.match(migration, /security_events_immutable/);
  assert.match(migration, /can_manage_organization\(organization_id\)/);
  assert.match(migration, /security events are immutable/);
});

test("v2 sensitive approvals require a different decision maker", async () => {
  const migration = await readFile(
    "supabase/migrations/20260802090000_v2_security_privacy_launch.sql",
    "utf8",
  );
  assert.match(migration, /decided_by <> requested_by/);
  assert.match(migration, /two-person approval required/);
  assert.match(migration, /FOR UPDATE/);
});

test("v2 privacy requests are authenticated and documented", async () => {
  const migration = await readFile(
    "supabase/migrations/20260802090000_v2_security_privacy_launch.sql",
    "utf8",
  );
  const edge = await readFile("supabase/functions/privacy-requests/index.ts", "utf8");
  assert.match(migration, /privacy_request_self_create/);
  assert.match(edge, /requireUser/);
  assert.match(edge, /privacy_request_submitted/);
});

test("v2 document downloads require a clean scan verdict", async () => {
  const migration = await readFile(
    "supabase/migrations/20260802090000_v2_security_privacy_launch.sql",
    "utf8",
  );
  const documents = await readFile("src/routes/app.documents.tsx", "utf8");
  assert.match(migration, /scan\.status = 'clean'/);
  assert.match(migration, /claim_file_scan_jobs/);
  assert.match(documents, /get_document_scan_status/);
});

test("v2 device sessions store only hashed network identifiers", async () => {
  const migration = await readFile(
    "supabase/migrations/20260802090000_v2_security_privacy_launch.sql",
    "utf8",
  );
  const edge = await readFile("supabase/functions/security-center/index.ts", "utf8");
  assert.match(migration, /ip_hash text/);
  assert.doesNotMatch(migration, /\bip_address\b/);
  assert.match(edge, /sha256\(`\$\{salt\}:\$\{ip\}`\)/);
});

test("v2 workflows are versioned and cannot complete with missing required steps", async () => {
  const migration = await readFile(
    "supabase/migrations/20260802100000_v2_operations_control.sql",
    "utf8",
  );
  assert.match(migration, /workflow_template_versions/);
  assert.match(migration, /workflow_step_results/);
  assert.match(migration, /required workflow steps are incomplete/);
  assert.match(migration, /UNIQUE \(organization_id, idempotency_key\)/);
});

test("v2 corrective actions require evidence before verification", async () => {
  const migration = await readFile(
    "supabase/migrations/20260802100000_v2_operations_control.sql",
    "utf8",
  );
  assert.match(migration, /transition_corrective_action/);
  assert.match(migration, /verification evidence required/);
  assert.match(migration, /verification requires manager/);
  assert.match(migration, /corrective_action_events/);
});

test("v2 exceptions enter one tenant-scoped operations inbox", async () => {
  const migration = await readFile(
    "supabase/migrations/20260802100000_v2_operations_control.sql",
    "utf8",
  );
  const control = await readFile("src/routes/app.control-centre.tsx", "utf8");
  assert.match(migration, /unified_inbox_items/);
  assert.match(migration, /can_read_organization\(organization_id\)/);
  assert.match(migration, /trg_temperature_corrective_action/);
  assert.match(migration, /trg_sensor_excursion_corrective_action/);
  assert.match(control, /transition_corrective_action/);
});

test("v2 sensor offline detection runs only through the cron service role", async () => {
  const migration = await readFile(
    "supabase/migrations/20260802100000_v2_operations_control.sql",
    "utf8",
  );
  const edge = await readFile("supabase/functions/operations-dispatch/index.ts", "utf8");
  assert.match(migration, /auth\.role\(\) <> 'service_role'/);
  assert.match(migration, /REVOKE ALL ON FUNCTION public\.dispatch_operations_control/);
  assert.match(edge, /constantTimeEqual/);
  assert.match(edge, /x-cron-secret/);
});

test("v2 traceability and governed content preserve source and approval evidence", async () => {
  const migration = await readFile(
    "supabase/migrations/20260802100000_v2_operations_control.sql",
    "utf8",
  );
  assert.match(migration, /traceability_edges/);
  assert.match(migration, /recall_drills/);
  assert.match(migration, /regulatory_content_versions/);
  assert.match(migration, /source_url text NOT NULL/);
  assert.match(migration, /review_statement text/);
  assert.match(migration, /training_course_versions/);
});
