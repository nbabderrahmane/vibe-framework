# rules_uiux.md — UI/UX Design Rules
# Read ONLY when UI is being designed or implemented.

## RULE 1: Four States Mandatory
Every async UI element MUST have these 4 states:
- **Loading**: Skeleton (not spinner) matching content layout
- **Empty**: Helpful message + CTA (never blank screen)
- **Error**: Actionable message + retry button (never raw error)
- **Success**: Clear confirmation of what happened

Violation = automatic FAIL in QA.

## RULE 2: Mobile-First
- Design base styles for mobile (320px minimum)
- Add complexity with `md:` (768px) and `lg:` (1024px) breakpoints
- Touch targets minimum 44x44px
- No horizontal scroll on mobile

## RULE 3: Consistency Over Novelty
- Use existing components before creating new ones
- One pattern per interaction type (one toast system, one modal system, one form pattern)
- Design tokens from single source (colors, spacing, typography, border-radius)

## RULE 4: Feedback Is Immediate
- Button click → visual feedback within 100ms
- Form submit → loading state on button + disabled inputs
- Optimistic updates where safe (with rollback on failure)
- Toast/notification for background operations

## RULE 5: No Dead Ends
- Every error state has a way out (retry, go back, contact support)
- Every empty state has a CTA (create first item, adjust filters)
- 404 page has navigation back to main areas
- Permission denied has explanation + who to contact

## RULE 6: Destructive Actions Protected
- Delete/remove requires confirmation dialog
- Confirmation dialog names what will be destroyed
- Undo preferred over confirm where possible
- No destructive action on single click

## RULE 7: Accessibility Baseline (WCAG AA)
- Color contrast ratio ≥ 4.5:1 for text
- All interactive elements keyboard-accessible
- Focus visible on all interactive elements
- Alt text on meaningful images
- Form inputs have labels (not just placeholders)
- Error messages associated with fields (aria-describedby)

## RULE 8: Copy Quality
- Error messages: say what happened + what to do (never "Error occurred")
- Button labels: action verbs ("Save changes" not "Submit")
- Empty states: encouraging, not sad ("No projects yet. Create your first one!")
- No technical jargon in user-facing copy
- Consistent terminology (don't mix "delete"/"remove"/"trash")

## RULE 9: Progressive Disclosure
- Show essential information first
- Advanced options behind expandable sections or secondary views
- Don't overwhelm: max 5-7 actions visible at once
- Wizards for complex multi-step processes

## RULE 10: Performance Perception
- Skeleton loaders (not spinners) for content areas
- Instant navigation feel (prefetch, optimistic routing)
- Images lazy-loaded below fold
- Perceived performance > actual performance
