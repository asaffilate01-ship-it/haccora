# Upload and release handoff

## Upload this project

The distributed ZIP contains the repository contents but intentionally excludes `.git`, `.env`, `node_modules`, build output and local caches.

1. Create an empty GitHub repository or open the existing Haccora repository.
2. Extract the ZIP into the repository root.
3. Review `git diff`, especially the new production migration. Do not squash or rewrite existing Lovable history.
4. Delete the tracked root `.env` and the six duplicate migration files listed in `docs/MIGRATION_RECONCILIATION.md`; uploading a ZIP alone does not delete files already in GitHub.
5. Run `npm ci`, `npm run quality`, the native checks and the Edge Function checks locally.
6. Commit on a branch and open a pull request.
7. Require all three `Production checks` jobs to pass before merging.

## Required deployment order

1. Create a separate Supabase staging project and configure Auth redirect URLs.
2. Reconcile the remote migration ledger using `docs/MIGRATION_RECONCILIATION.md`, then apply the canonical migrations in timestamp order.
3. Set Edge Function secrets from `.env.example` and deploy the functions in `supabase/functions`.
4. Test isolation with two unrelated organizations and a third inspector user.
5. Configure web hosting secrets, deploy to staging, and exercise the release checklist.
6. Back up production, schedule the cut-over, apply the migration and verify audit/storage policies.
7. Run `eas init` in `mobile`, complete native signing/store metadata, and build iOS/Android release candidates.

Never upload `.env`, service-role keys, device secrets, signing certificates or store credentials to GitHub. The previous tracked `.env` contained Supabase project identifiers and publishable client keys rather than a service-role key, but it must still be removed so production configuration cannot drift into source control.
