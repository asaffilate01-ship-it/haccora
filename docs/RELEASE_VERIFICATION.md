# Release verification record

Verified: 2026-08-02

## Source checks completed

| Gate                         | Result                                                         |
| ---------------------------- | -------------------------------------------------------------- |
| Gate                         | Result                                                         |
| ---------------------------- | -------------------------------------------------------------  |
| Reproducible installs        | Root, native and Edge lockfile installs passed                 |
| Production structure         | Passed                                                         |
| Migration lineage            | Passed for 17 canonical migrations                             |
| Secret-pattern scan          | Passed; tracked runtime `.env` removed                         |
| Web TypeScript               | Passed                                                         |
| Security regression suite    | 33 of 33 tests passed                                          |
| Web lint                     | Passed with zero warnings                                      |
| Cloudflare production build  | Passed                                                         |
| Root dependency audit        | 0 known runtime vulnerabilities                                |
| Native TypeScript            | Passed                                                         |
| Native dependency audit      | 0 known runtime vulnerabilities                                |
| Edge Function formatting     | Passed with Deno 2.9.4                                         |
| Edge Function lint           | Passed with Deno 2.9.4                                         |
| Edge Function type check     | Passed for all 14 deployable functions                         |
| Edge dependency audit        | 0 known runtime vulnerabilities                                |
| GitHub security automation   | CodeQL workflow configured; GitHub-hosted run still required   |
| Patch whitespace/formatting  | Passed `git diff --check` and repository Prettier verification |

## Known source advisory

The web build reports a 625.85 kB minified initial client chunk (184.26 kB gzip) and an ineffective dynamic import of the shared Supabase client. This is a performance follow-up, not a build or security failure, but route/vendor splitting should be measured before a high-traffic launch.

## What this record does not certify

The migrations have passed source-lineage checks but have not been applied to a fresh staging project or reconciled with the real Supabase migration ledger. Native source has been type-checked but has not been signed, installed on the final device matrix or submitted to Apple and Google. GitHub Actions and CodeQL must pass on the uploaded branch. This record also does not replace penetration testing, accessibility/device testing, restore testing, legal/privacy review or food-safety specialist validation.

Use the acceptance tests in `PRODUCTION_READINESS.md` and the deployment order in `DEPLOYMENT.md` before production traffic.
