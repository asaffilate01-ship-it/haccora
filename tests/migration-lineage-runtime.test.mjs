import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

const run = promisify(execFile);
const checker = path.resolve("scripts/check-migration-lineage.mjs");
const canonicalFiles = [
  "20260801090000_production_tenancy_security.sql",
  "20260802090000_v2_security_privacy_launch.sql",
  "20260802100000_v2_operations_control.sql",
  "20260802103319_63102a85-216e-4527-ab82-2f9dc19862bb.sql",
  "20260802120000_v2_commercial_reconciliation.sql",
];

async function fixture(lastMigration) {
  const directory = await mkdtemp(path.join(os.tmpdir(), "haccora-migrations-"));
  await Promise.all(
    canonicalFiles.map((file, index) =>
      writeFile(
        path.join(directory, file),
        index === 3
          ? "CREATE POLICY tenant_read ON public.example FOR SELECT USING (true);"
          : index === 4
            ? lastMigration
            : "SELECT 1;",
      ),
    ),
  );
  return directory;
}

test("migration checker rejects an unguarded duplicate policy", async () => {
  const directory = await fixture(
    "CREATE POLICY tenant_read ON public.example FOR SELECT USING (true);",
  );
  try {
    await assert.rejects(
      run(process.execPath, [checker], {
        env: { ...process.env, HACCORA_MIGRATION_DIR: directory },
      }),
      (error) => /Duplicate policy declaration public\.example\.tenant_read/.test(error.stderr),
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("migration checker permits an explicit policy replacement", async () => {
  const directory = await fixture(`
    DROP POLICY IF EXISTS tenant_read ON public.example;
    CREATE POLICY tenant_read ON public.example FOR SELECT USING (true);
  `);
  try {
    const { stdout } = await run(process.execPath, [checker], {
      env: { ...process.env, HACCORA_MIGRATION_DIR: directory },
    });
    assert.match(stdout, /Migration lineage verification passed/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
