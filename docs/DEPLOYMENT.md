# Staging and production deployment

Deploy to a separate Supabase staging project first. A successful local build does not validate RLS against real Postgres data or configure external providers.

## Database and generated types

1. Back up the target database and storage.
2. Apply migrations in timestamp order with the Supabase CLI.
3. Reconcile legacy ownership using `DATA_MIGRATION.md`.
4. Correct any historical temperature rows outside the documented range, then run:

   ```sql
   ALTER TABLE public.temperature_logs
     VALIDATE CONSTRAINT ck_temperature_evidence_range;
   ```

5. Regenerate `src/integrations/supabase/types.ts` from the staging schema and rerun `npm run quality`.

## Edge Functions

Set `ALLOWED_ORIGINS`, `CONTACT_HASH_SALT`, `CRON_SECRET`, `PUBLIC_APP_URL`, `RESEND_API_KEY`, `NOTIFICATION_FROM_EMAIL` and, when used, `EXPO_ACCESS_TOKEN` in Supabase secrets. The service-role key and built-in Supabase URL/auth keys are supplied by the function runtime and must never enter client variables.

Deploy every directory under `supabase/functions`. JWT behavior is declared in `supabase/config.toml`.

Call `notification-dispatch` from an authenticated scheduler at least every 15 minutes using a POST request and the `x-cron-secret` header. The dispatcher reclaims interrupted jobs, retries with backoff, dead-letters after five attempts, and creates each enabled weekly digest once on Monday UTC. Monitor non-2xx responses and dead-letter rows.

Sensor secrets are returned once by `sensor-provision`. Deliver each secret through a secure device-management channel; never store it in GitHub, support tickets or analytics. Sensor POSTs use `x-device-secret` and must provide a globally unique event ID.

## Release verification

- Run `npm run quality`, `npm audit --omit=dev`, the native typecheck/audit and the Edge Function Deno checks.
- Exercise the ten acceptance tests in `PRODUCTION_READINESS.md` against staging.
- Verify real redirect URLs, CORS origins, email delivery, push receipts, signed-document expiry and scheduler alerts.
- Obtain legal/privacy, food-safety, security and product-owner sign-off before production traffic.
