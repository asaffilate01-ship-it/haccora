# Haccora

Haccora is a bilingual food-safety and restaurant-operations platform for Germany. This repository contains the TanStack Start web app, Supabase database and Edge Functions, a PWA shell, and an Expo/React Native app for native iOS and Android builds.

## What is implemented

- Organization/location tenancy, membership roles and time-limited inspector grants
- Tenant-scoped RLS, private evidence storage and restricted health records
- HACCP, checks, temperature, cleaning, training, documents, audits, incidents, traceability, stock and supplier workflows
- Corrective actions, HACCP plan versions and tamper-evident audit events
- Server-owned subscriptions, Stripe billing, encrypted outbound webhooks and delivery retries
- Persistent security centre, privacy requests, accessibility preferences and sync-conflict review
- Contact, PDF evidence export, notification queue, team/inspector invitation, sensor provisioning and sensor-ingest Edge Functions
- Native iOS/Android workflows for checks, temperature, actions, incidents and document evidence with secure offline queues and biometric lock
- Security headers, PWA support, reproducible lockfiles, CodeQL, CI and production deployment runbooks

## Local web setup

```bash
cp .env.example .env
npm ci
npm run dev
```

Use only the Supabase publishable key in `VITE_*` values. This release does not require a service-role key in the web-hosting environment; Supabase provides it directly to deployed Edge Functions. Never expose it to either client.

## Verification

```bash
npm run quality
npm run migrations:check
```

The Supabase migration must also be applied to a fresh staging project and tested with at least two organizations plus an external inspector account before production data is accepted.

## Native apps

See [mobile/README.md](mobile/README.md). Apple and Google developer accounts, signing credentials, privacy declarations and store review are external launch requirements; they are never stored in this repository.

## Deployment

Follow [UPLOAD_TO_GITHUB.md](UPLOAD_TO_GITHUB.md), [docs/MIGRATION_RECONCILIATION.md](docs/MIGRATION_RECONCILIATION.md), [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md), [docs/GO_LIVE_CHECKLIST.md](docs/GO_LIVE_CHECKLIST.md) and [docs/PRODUCTION_READINESS.md](docs/PRODUCTION_READINESS.md). Do not market the product as legally guaranteed or use placeholder legal identity details.
