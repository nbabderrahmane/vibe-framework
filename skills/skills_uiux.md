# skills_uiux.md — UI/UX Design Patterns & Standards
# Read ONLY when UI is being designed or implemented.

## Design Philosophy
Embeds principles of: Dieter Rams (10 Principles), Jakob Nielsen (10 Heuristics), Don Norman (Design of Everyday Things), Alan Cooper (About Face), Susan Kare (Icon design).

## Component Patterns

### Data Table
- Column headers: sortable, filterable
- Rows: hover state, selectable if bulk actions exist
- Pagination: count, page size selector, navigation
- States: empty, loading (skeleton rows), error (inline retry)
- Responsive: stack or horizontal scroll on mobile

### Modal / Dialog
- Max width: 500px (S), 700px (M), 900px (L)
- Always: title, close (X + ESC), focus trap
- Destructive: red primary action, explicit naming
- Form modals: validate before close, warn on unsaved

### Form
- Single column layout. Labels above input.
- Required: asterisk on label. Validation: blur + submit.
- Errors: below field, red, icon + message.
- Submit: right-aligned, primary, loading state.

### Toast / Notification
- Position: top-right (desktop), top-center (mobile)
- Duration: 5s default, persistent for errors
- Types: success (green), error (red), warning (yellow), info (blue)
- Max 3 visible, queue the rest

### Navigation
- Primary: left sidebar (desktop), bottom bar (mobile)
- Breadcrumbs for depth > 2. Active state clear.
- Icons with labels (icon-only confuses users)

## Color System
Primary (brand CTA), Secondary (supporting), Destructive (danger), Muted (disabled/borders), Background, Foreground, Accent.
Semantic: Success=green, Warning=amber, Error=red, Info=blue.

## Spacing System
Base: 4px. Scale: 0,1,2,3,4,5,6,8,10,12,16,20,24.
Inline: 4-8px. Related items: 8-12px. Sections: 16-24px. Page: 32-48px.

## Typography
xs=12px, sm=14px, base=16px, lg=18px, xl=20px, 2xl=24px, 3xl=30px, 4xl=36px.
Weights: normal(400), medium(500), semibold(600), bold(700).

## Animation
Purposeful, 150-300ms for feedback, 300-500ms for layout. Ease-out for enter, ease-in for exit. Respect prefers-reduced-motion.
