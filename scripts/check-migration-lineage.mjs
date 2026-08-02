import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const migrationDirectory = path.resolve("supabase/migrations");
const failures = [];
const requiredCanonicalMigrations = [
  "20260801090000_production_tenancy_security.sql",
  "20260802090000_v2_security_privacy_launch.sql",
  "20260802100000_v2_operations_control.sql",
  "20260802110000_v2_commercial_native_integrations.sql",
];
const removedDuplicateMigrations = [
  "20260802083308_aa031c95-39d7-44b9-9677-f99519895f14.sql",
  "20260802083626_4bf8a58a-1dc9-4b17-a287-68fdfb6129d8.sql",
  "20260802083657_22e0ce1a-4b75-4fbf-9665-aa60827aa6a2.sql",
  "20260802083707_fe91f7e5-12b7-406e-a813-469b58848b74.sql",
  "20260802093624_2011b293-2d93-46fb-a6c7-8c53165e7752.sql",
  "20260802093838_c79dcb7d-1b86-4b56-bed6-e3fd2828416c.sql",
];

const files = (await readdir(migrationDirectory)).filter((file) => file.endsWith(".sql")).sort();
const versions = new Map();

for (const file of files) {
  const match = /^(\d{14})_.+\.sql$/.exec(file);
  if (!match) {
    failures.push(`Invalid migration filename: ${file}`);
    continue;
  }
  if (versions.has(match[1])) {
    failures.push(`Duplicate migration version ${match[1]}: ${versions.get(match[1])} and ${file}`);
  }
  versions.set(match[1], file);
  if (!(await readFile(path.join(migrationDirectory, file), "utf8")).trim()) {
    failures.push(`Empty migration: ${file}`);
  }
}

for (const file of requiredCanonicalMigrations) {
  if (!files.includes(file)) failures.push(`Missing canonical migration: ${file}`);
}
for (const file of removedDuplicateMigrations) {
  if (files.includes(file)) failures.push(`Removed duplicate migration returned: ${file}`);
}

const canonicalPositions = requiredCanonicalMigrations.map((file) => files.indexOf(file));
if (canonicalPositions.some((position) => position < 0)) {
  // Missing migrations are reported above.
} else if (
  canonicalPositions.some(
    (position, index) => index > 0 && position <= canonicalPositions[index - 1],
  )
) {
  failures.push("Canonical production migrations are not in chronological order");
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`Migration lineage verification passed (${files.length} migrations).`);
