# Required tracked-file removals

Apply these removals in the same pull request as the go-live phase files:

- `.env` — runtime environment files must never be tracked. Keep production values in the hosting and Supabase secret stores.
- `supabase/migrations/20260802110000_v2_commercial_native_integrations.sql` — this near-duplicate repeats the earlier Lovable-generated commercial migration.

Do not delete live database objects merely because a migration file was removed. Before deployment, archive `supabase migration list`, follow `docs/MIGRATION_RECONCILIATION.md`, and reconcile the linked project's ledger with the database owner.
