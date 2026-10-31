# Haccora Germany: design, AI and MCP upgrade review — 31 October 2026

## Baseline
German/English TanStack/Expo/Supabase product has RLS, HACCP, corrective actions, inspector grants, offline evidence, sensors, billing and Omniqora AI bridging. Preserve `Europe/Berlin` operational-day boundaries and `de-DE` localisation.

## Practical build priorities
- **P0:** Control Centre must fail closed on failed inbox or corrective-action reads, avoid stale responses, expose retry and distinguish no records from food-safety clearance. Disclose the 150-row sample cap.
- **P1:** German-native mobile UI and robust offline return/sync, including authentic physical-premises testing.
- **P1:** Digital HACCP control-point records and corrective action trace; verified regulatory references and locally reviewed food categories; no auto-certification.
- **P2:** German staff onboarding/training and documentary evidence reminders with explicit administrative validity checks.
- **P2:** Supplier changes, product/allergen updates, label generation and withdrawals with accountable sign-off.
- **P3:** Read-only Omniqora evidence search and incident review assistants with bilingual citations, trained supervisors approving any proposed changes.

## Regulatory review anchors
- EU food hygiene HACCP requirements: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32004R0852
- German LMHV: https://www.gesetze-im-internet.de/lmhv_2007/BJNR181700007.html
- German IfSG §43: https://www.gesetze-im-internet.de/ifsg/__43.html
- Legal requirements and local authority practice must be reviewed by competent German professionals; no AI-generated legal approval.

## Evaluated source candidates (review before adopting)
- Taste Skill — https://github.com/Leonxlnx/taste-skill — audit-first typography, layout, measured motion; use design rules, not an unreviewed dependency.
- Impeccable — https://github.com/pbakaus/impeccable — critique, harden, adapt and anti-pattern detection.
- Awesome DESIGN.md — https://github.com/VoltAgent/awesome-design-md — reference for documenting Haccora's own tokens; do not clone another brand's identity.
- Radix UI and shadcn/ui — https://github.com/radix-ui/primitives and https://github.com/shadcn-ui/ui — *already represented* in current code; improve shared components rather than replacing the UI stack.
- Playwright MCP — https://github.com/microsoft/playwright — isolated staging role/mobile/browser verification, never production mutation.
- OpenFGA — https://github.com/openfga/openfga — evaluate only if current Supabase RLS and scoped inspector grants prove insufficient.
- Langfuse — https://github.com/langfuse/langfuse — optional redacted AI run traces and human-review evaluation.
- Trigger.dev — https://github.com/triggerdotdev/trigger.dev — optional durable agent reviews; compare against current Supabase queues/cron to avoid a second scheduler.
- Unstructured — https://github.com/Unstructured-IO/unstructured — candidate for document ingestion with manual verification of extracted allergens/limits.
- MCP references — https://github.com/modelcontextprotocol/servers — educational reference code; not production-ready by default.

## Proposed approved Omniqora/MCP action contract
1. Tools are scoped by authenticated organisation, site, user role, country, purpose and granted resources; the service checks rights at every call. Never trust tool-provided URLs or instructions.
2. Read-only tools initially: list due checks, cite source-controlled HACCP/food guidance, summarise exceptions, find evidence, draft action plans.
3. Every answer displays source, content revision, local premises date/time, uncertainty, and source freshness. Missing/unverified evidence must be labelled **unknown**, never compliant.
4. Any action that creates/modifies records, emails a regulator, issues a recall, prints a label, or alters a critical limit requires an explicit human confirmation, server-side role enforcement, idempotency, and append-only audit event.
5. Uploaded PDFs/images and MCP tool responses are untrusted inputs. Isolate tenant-specific retrieval, strip PII from telemetry, protect provider credentials and record a reviewable decision trail.
6. Do not activate extra AI services until a staging tenant-denial test, human-review test, failure test, and data-protection/food-safety review pass.

## Design acceptance
- Glove-friendly minimum 48px touch targets where glove mode applies; keyboard focus always visible; screen-reader announcements on failure.
- Narrow mobile, tablet, desktop, light/dark, high contrast, German long text and reduced motion.
- Error, loading, offline, zero records, partial/150-capped results, expired evidence and access denied are distinct states.
- No unearned green status, claimed 100% compliance, auto-certification, hygiene rating or legal approval.
- Preserve current navigation, auth, Supabase RLS, locale/timezone and owner/manager/chef/staff/inspector duties.
- Verify source changes with `npm run quality`, real browser journeys, staging RLS/migrations and physical offline sync; this document alone is not runtime acceptance.
