# Haccora go-live checklist

Production release is approved only when every P0 item is complete and linked evidence has an owner and date. Source checks prove the repository; they do not prove the deployed environment.

## P0 — source and release controls

- [ ] The six duplicate migrations in `MIGRATION_RECONCILIATION.md` are deleted from GitHub.
- [ ] The tracked root `.env` is deleted; GitHub secret scanning and private vulnerability reporting are enabled.
- [ ] `npm ci`, `npm run quality` and `npm audit --omit=dev` pass from the committed root lockfile.
- [ ] Native `npm ci`, typecheck and runtime dependency audit pass from `mobile/package-lock.json`.
- [ ] Deno format, lint and typecheck pass for every Edge Function using the committed import map and pinned CI toolchain.
- [ ] Production checks and CodeQL are green on the release pull request.
- [ ] Branch protection requires review and passing checks before `main` can change.

## P0 — database and tenant isolation

- [ ] The remote Supabase migration ledger is archived and reconciled.
- [ ] All migrations apply to a new empty staging project.
- [ ] Generated TypeScript types match the staging schema.
- [ ] Owner A cannot access Owner B through PostgREST, RPC, realtime, storage, exports or signed URLs.
- [ ] Staff, manager, owner and inspector role/transition matrices pass.
- [ ] Inspector scope and expiry are tested before, during and after access.
- [ ] Backup restore is completed and measured RPO/RTO evidence is stored outside the primary project.

## P0 — providers and operations

- [ ] `npm run launch:preflight` passes using production values outside Git.
- [ ] Auth redirects, CORS origins, MFA, rate limits and recovery policy are configured.
- [ ] Resend email and Expo push delivery/receipt handling are verified.
- [ ] The malware scanner fails closed and clean/infected/retry/dead-letter paths are tested.
- [ ] Stripe live-mode checkout, renewal, failure, cancellation, duplicate and out-of-order events pass.
- [ ] Webhook delivery signature, SSRF egress control, retry and dead-letter behaviour pass.
- [ ] All four dispatch schedules have missed-run and dead-letter alerts.
- [ ] Error reporting, uptime checks, on-call routing and incident contacts are tested.

## P0 — legal, privacy and food safety

- [ ] Real company identity, support and status details replace placeholders.
- [ ] German/English privacy, cookies, terms and imprint receive documented counsel approval.
- [ ] GDPR/DPA, retention, deletion and legal-hold handling receive approval.
- [ ] A qualified food-safety specialist approves HACCP templates, limits and claims.
- [ ] Independent penetration testing is complete and high/critical findings are closed.

## P1 — web and native experience

- [ ] Keyboard, screen-reader, 200% zoom, reduced-motion, high-contrast and Glove Mode tests pass.
- [ ] Supported browser, tablet and phone matrices pass.
- [ ] Offline capture, termination, reconnect, duplicate retry and conflict review pass on two devices.
- [ ] EAS project ID, Apple/Google teams, signing, privacy declarations and store metadata are complete.
- [ ] Camera/document denial, biometric fallback and notification permissions pass on representative iOS/Android devices.
- [ ] Signed release candidates are installed from TestFlight and Play internal testing before submission.

## Release decision

- [ ] Product owner approval
- [ ] Security approval
- [ ] Privacy/legal approval
- [ ] Food-safety specialist approval
- [ ] Operations/on-call approval
- [ ] Rollback owner, release window and post-release monitoring window recorded
