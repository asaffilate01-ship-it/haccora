# Migration reconciliation — mandatory before deployment

The repository previously contained six generated migrations that repeated the canonical production, security and operations migrations. They have been removed from this release because a fresh database would otherwise encounter duplicate tables, constraints or policies.

## Files that must be deleted from the GitHub repository

- `20260802083308_aa031c95-39d7-44b9-9677-f99519895f14.sql`
- `20260802083626_4bf8a58a-1dc9-4b17-a287-68fdfb6129d8.sql`
- `20260802083657_22e0ce1a-4b75-4fbf-9665-aa60827aa6a2.sql`
- `20260802083707_fe91f7e5-12b7-406e-a813-469b58848b74.sql`
- `20260802093624_2011b293-2d93-46fb-a6c7-8c53165e7752.sql`
- `20260802093838_c79dcb7d-1b86-4b56-bed6-e3fd2828416c.sql`

All six are under `supabase/migrations/`.

## Canonical production sequence

1. `20260801090000_production_tenancy_security.sql`
2. `20260802090000_v2_security_privacy_launch.sql`
3. `20260802100000_v2_operations_control.sql`
4. `20260802110000_v2_commercial_native_integrations.sql`

Earlier dated migrations remain in place and run before this sequence.

## Safe reconciliation procedure

1. Back up the linked Supabase database and storage before changing migration history.
2. Record the remote ledger with `supabase migration list`; retain the output with the release evidence.
3. Apply this repository to a new, empty staging project. `npm run migrations:check` must report 17 migrations before the database is reset.
4. Run the entire migration sequence on fresh staging and regenerate Supabase TypeScript types from that schema.
5. Compare the fresh schema with the linked project. Confirm that canonical objects, grants, functions, policies and constraints are equivalent.
6. If the remote ledger contains one of the removed generated versions, do not drop live database objects. Reconcile ledger entries only after reviewing the recorded remote list, the fresh-schema comparison and a rollback plan with the database owner.
7. Apply only migrations that the reconciled remote ledger has not already executed.

Never solve a migration-ledger mismatch by force-pushing history, deleting production tables, or blindly marking every migration as applied. The repository is connected to Lovable, so use a normal branch and pull request and preserve published history.
