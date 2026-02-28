# rules_essential.md — P0 Non-Negotiable Rules (< 2K tokens)
# READ THIS BEFORE EVERY SINGLE RESPONSE. NO EXCEPTIONS.

## 1. NO HALLUCINATION
- Never invent requirements, APIs, file paths, or behaviors.
- If unsure: state "ASSUMPTION" explicitly, propose 2 options, pick a default.
- If a file/function/endpoint doesn't exist: SAY SO. Don't fabricate it.

## 2. NO SILENT FAILURES
- Every async operation has try/catch with CONTEXT (what failed, where, input).
- Every error surfaces to the user with an actionable message.
- Never: empty catch blocks, console.log-only error handling, swallowed promises.

## 3. NO SECURITY SHORTCUTS
- Never expose secrets in code, logs, or client bundles.
- Every server action/API route validates auth BEFORE business logic.
- RLS on every Supabase table. No exceptions.
- Input validation (Zod) on every server boundary.
- Never use `dangerouslySetInnerHTML` with user content.
- Never expose service role key to client.

## 4. TYPE SAFETY
- TypeScript strict mode. No `any`. No `as unknown as X`.
- Define interfaces/types for all data shapes.
- Zod schemas for runtime validation at boundaries.

## 5. SMALL, REVIEWABLE CHANGES
- Functions < 20 lines. Single responsibility.
- One concern per file. No god files (> 300 lines = split).
- Keep diffs small and reversible.

## 6. NAMING & READABILITY
- Intention-revealing names. No abbreviations.
- No magic numbers/strings — use named constants.
- No stale comments. No TODO without owner.

## 7. FOLLOW EXISTING PATTERNS
- Read `CODE_INVENTORY.md` BEFORE coding.
- Follow established patterns in the project.
- If introducing new pattern: document it in CODE_INVENTORY.md.

## 8. TEST WHAT MATTERS
- New feature = new tests (at least happy path + main error path).
- Bug fix = regression test.
- Test naming: `should_[behavior]_when_[condition]`

## 9. UPDATE THE VAULT
- After ANY implementation work, update:
  - `LOGS.md` (what/where/why)
  - `CODE_INVENTORY.md` (new files/patterns)
  - `RUNBOOK.md` (if env/run steps changed)
  - `SESSION_LOG.md` (always)

## 10. CONTEXT MANAGEMENT
- Estimate context budget before starting.
- If budget > 70%: STOP, propose splitting.
- If session > 10 messages: produce CONTEXT_SNAPSHOT.md.
- If debug > 5 messages without resolution: STOP → snapshot → new chat.
- NEVER continue past context limits — quality degrades silently.

## COMPLIANCE CHECK
After EVERY response, mentally verify:
- ✅ No hallucinated paths/APIs/behaviors
- ✅ All errors handled with context
- ✅ No security shortcuts
- ✅ Types are strict
- ✅ Following existing patterns
- ✅ Vault updated (if implementation work)
