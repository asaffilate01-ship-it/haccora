# Upload and release handoff

## Upload this project

The distributed ZIP contains the repository contents but intentionally excludes `.git`, `.env`, `node_modules`, build output and local caches.

1. Create an empty GitHub repository or open the existing Haccora repository.
2. Extract the ZIP into the repository root.
3. Review `git diff`, especially the new production migration. Do not squash or rewrite existing Lovable history.
4. Commit on a branch and open a pull request.
5. Require the `Production checks` workflow before merging.

## Required deployment order

1. Create a separate Supabase staging project and configure Auth redirect URLs.
2. Apply all migrations in timestamp order.
3. Set Edge Function secrets from `.env.example` and deploy the functions in `supabase/functions`.
4. Test isolation with two unrelated organizations and a third inspector user.
5. Configure web hosting secrets, deploy to staging, and exercise the release checklist.
6. Back up production, schedule the cut-over, apply the migration and verify audit/storage policies.
7. Run `eas init` in `mobile`, complete native signing/store metadata, and build iOS/Android release candidates.

Never upload `.env`, service-role keys, device secrets, signing certificates or store credentials to GitHub.
