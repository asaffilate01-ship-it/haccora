<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## UI / UX design quality
- For any UI task read root `PRODUCT.md` and `DESIGN.md`; the existing app's tokens, components and product truth remain authoritative.
- Use Taste Skill for deliberate art direction, Impeccable for targeted critique/audit/hardening and Awesome DESIGN.md as a design-document reference. Do not copy external brands.
- Preserve existing auth/role policies, routes, production contracts, and Lovable git history; never force push.
- Run the existing relevant tests/build plus optional `npx --yes impeccable@4.8.0 detect src/`; verify actual mobile/desktop rendered pages and report incomplete acceptance.
