# rules_full.md — Complete Rulebook by Domain
# Read only when working on the specific domain.

---

## DOMAIN: Authentication & Authorization

### Auth Flow
- Use Supabase Auth (or project auth provider) exclusively.
- Session management: server-side validation on every protected route.
- Never store tokens in localStorage (use httpOnly cookies or Supabase session).
- Logout must clear all session artifacts.

### RBAC
- Define roles in DB, not in code constants.
- Every route/action checks role BEFORE executing.
- Default deny: if no explicit permission, deny access.
- Admin routes must have double-check (role + explicit admin flag).

### RLS (Supabase-specific)
- Every table has RLS enabled.
- Policies follow principle of least privilege.
- Test RLS policies with different roles (anon, authenticated, admin).
- Service role key NEVER in client code.
- Storage buckets: RLS policies on files too.

---

## DOMAIN: Database & Data

### Schema Design
- Use UUIDs for primary keys (not sequential integers).
- Every table has: `id`, `created_at`, `updated_at`.
- Soft delete preferred (`deleted_at` timestamp) over hard delete.
- Foreign keys with appropriate ON DELETE behavior (CASCADE/SET NULL/RESTRICT).
- Indexes on: foreign keys, frequently queried columns, unique constraints.

### Migrations
- Always reversible (provide rollback SQL).
- Idempotent (IF NOT EXISTS / IF EXISTS guards).
- Never modify production data in migration files (use separate data scripts).
- Test migrations with `supabase db reset` locally.
- Naming: `YYYYMMDD_HHMMSS_description.sql`

### Queries
- No N+1 queries (use joins or batch fetching).
- No `SELECT *` in production code (select explicit columns).
- Parameterized queries only (no string interpolation in SQL).
- Use database-level constraints (not just app-level validation).

---

## DOMAIN: API & Server Actions

### Input Validation
- Zod schema on EVERY server action / API route input.
- Validate at the boundary, trust internally.
- Return structured errors (not raw exceptions).

### Error Responses
- Consistent error shape: `{ error: string, code: string, details?: object }`
- Never leak internal details (stack traces, SQL errors) to client.
- Log full error server-side, return sanitized message client-side.

### Patterns
- Service layer between route handlers and DB.
- Route handler → validate input → check auth → call service → return response.
- Reusable services (not duplicated logic across routes).

---

## DOMAIN: Frontend & React

### Component Architecture
- Server Components by default (Next.js App Router).
- Client Components only when: interactivity, browser APIs, hooks.
- Max component size: 150 lines. Split if larger.
- Composition over prop drilling (use context or composition patterns).

### State Management
- Server state: React Query / SWR (not manual fetch + useState).
- Client state: useState for local, useReducer for complex, Zustand for global.
- No redundant state (derive from source of truth).

### Forms
- React Hook Form (or project standard) + Zod validation.
- Validation on submit AND on blur for key fields.
- Disable submit button during processing.
- Show inline errors per field.

### Loading/Error/Empty States
- EVERY async UI has: Loading skeleton, Error with retry, Empty state with CTA.
- Optimistic updates where safe (with rollback on failure).
- Suspense boundaries at route level minimum.

---

## DOMAIN: Styling & CSS

- Tailwind CSS (or project standard) exclusively.
- No inline styles in JSX (except truly dynamic values).
- Design tokens (colors, spacing, fonts) from ONE source.
- Mobile-first: base styles = mobile, then `md:`, `lg:` breakpoints.
- Dark mode: support from day 1 if in scope (use CSS variables).

---

## DOMAIN: Testing

- Unit tests: pure functions, utilities, services.
- Integration tests: API routes, server actions, DB interactions.
- E2E tests: critical user flows (login, main happy path, payment if applicable).
- Test naming: `should_[behavior]_when_[condition]`.
- No test pollution: each test independent, clean up after itself.
- Mock external services, don't mock internal modules.

---

## DOMAIN: Performance

- Images: use `next/image` with proper sizing, WebP preferred.
- Code splitting: dynamic imports for heavy components.
- No unnecessary re-renders: memo, useMemo, useCallback where measured.
- Bundle analysis before release (no unexpected growth > 10%).
- Database: EXPLAIN on complex queries, index on slow queries.

---

## DOMAIN: Observability & Logging

- Structured logging (JSON format) with: timestamp, level, message, context.
- No `console.log` in production code. Use structured logger.
- Error tracking: Sentry (or equivalent) on both client and server.
- Key metrics: response time, error rate, active users.
- Health check endpoint.

---

## DOMAIN: Git & Version Control

- Branch naming: `feature/[short-desc]`, `fix/[short-desc]`, `hotfix/[short-desc]`.
- Commit messages: conventional commits (`feat:`, `fix:`, `chore:`, `docs:`).
- No direct push to main/production branch.
- Squash merge for feature branches.
- Tag releases with semver.
