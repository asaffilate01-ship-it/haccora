# Germany operational attention — 30 October 2026

The existing owner, manager, chef and staff dashboard now includes a German/English attention panel. The inspector dashboard remains separate. The panel links to the existing temperature, corrective-action, incident and check registers.

Counts include unfinished checks from earlier days as well as today's checks. Today's creation cohort supplies both completed and unfinished counts; the full aggregate is independent of the existing dashboard's 20-row task sample. No completion percentage appears for an empty cohort. Older checks are called unfinished, not assumed overdue.

Every request filters the active organisation and selected location when present. Access remains subject to existing database policies. Date bounds use Europe/Berlin and are recalculated on refresh. Loading, missing counts and errors hide the panel's metrics, with explicit retry feedback. Account/site changes discard stale results and remount the panel. The refresh timestamp describes a snapshot, not a live subscription. Signals may overlap across categories.

Validation covers failed and missing reads, explicit tenant/site/date filters, backlog counts, completion, account switches, retry recovery and German copy. No migrations or provider configuration are required. This panel is not an AI agent or a supplier-document extraction service; those remain subsequent work. Existing role dashboard metrics are not replaced by this phase.
