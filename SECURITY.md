# Security policy

Report suspected vulnerabilities privately to the production security contact configured on the public website. Do not include personal, health, authentication or customer evidence data in a public GitHub issue.

Supported production releases receive security fixes. Enable GitHub private vulnerability reporting for this repository and route it to the named production security owner. The current source requires a staging RLS test, CodeQL review, independent penetration test and the launch gates in `docs/GO_LIVE_CHECKLIST.md` before accepting real compliance data.

Secrets belong in the hosting provider or Supabase secret store. The repository and native clients may contain only publishable Supabase values.
