# Haccora design authority

## Core identity
Existing src/styles.css uses near-white/near-black OKLCH surfaces, high-contrast charcoal and alert-red semantic accent; current TanStack Start and mobile components remain authoritative. Avoid red for ornamental emphasis because it carries warning meaning.

## Intent and information hierarchy
- Audience: German catering and food-safety operators, staff and inspectors.
- Main goal: Document operational food-safety workflows, checks, corrective actions, training and inspection evidence.
- UX priority: Location/task scope, shift/date, inspection evidence, pass/fail severity, corrective-action owner and due date must be readable at a glance. German and English copy needs sufficient space; don't collapse compliance evidence into decorative cards.

## Cross-surface craft floor
- Preserve existing public routes, role boundaries, permissions, data provenance and required information fields. Only visual improvement is in scope.
- Make primary actions and current status unmistakable: title, summary, clear navigation, contextual help, inline errors, and recovery actions.
- Design for 360, 390, 768 and 1440px widths, 200% zoom, keyboard focus, reduced motion and light/dark themes. Review real rendered screenshots before approval.
- No fabricated data, legal claims, approvals, production statuses or human testimonials. No custom motion that interferes with essential tasks or screen readers.
- Keep existing component library, CSS tokens, typography and domain-specific state colours. Use copy and layout to reinforce meaning rather than replacing it with colourful charts.

## Design skills used
- [Taste Skill](https://github.com/Leonxlnx/taste-skill): brief-led layout, typography, art direction, cross-width inspection; adapt motion and density to task.
- [Impeccable](https://github.com/pbakaus/impeccable): `critique` > `audit` > `harden` > `polish` each high-impact flow, plus `npx --yes impeccable@4.8.0 detect src/` for an initial **advisory** quality baseline.
- [Awesome DESIGN.md](https://github.com/VoltAgent/awesome-design-md): design-document structure and tokens as reference; no third-party visual identity or trademark copying.

## Release quality gate
Existing lint/build/test jobs remain required; detector results are non-blocking until reviewed. On affected pages, verify accessible labels, keyboard and screen reader operation, long text, empty/failed/loading/offline/unauthorised states, print/PDF output where applicable, and responsive navigation. Record what was inspected and what could not be tested.
