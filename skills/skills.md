# skills.md — Coding Excellence Guidebook
# Read relevant sections only (tagged by domain).

---

## [ARCHITECTURE] Project Structure Patterns

### Next.js App Router (Standard)
```
/src
  /app              # Routes (page.tsx, layout.tsx, loading.tsx, error.tsx)
    /(auth)         # Auth-required routes (grouped)
    /(public)       # Public routes
    /api            # API routes (if needed)
  /components
    /ui             # Reusable primitives (Button, Input, Modal)
    /features       # Feature-specific components
    /layouts        # Layout components
  /lib
    /services       # Business logic (DB queries, external APIs)
    /utils          # Pure utility functions
    /hooks          # Custom React hooks
    /types          # TypeScript types/interfaces
    /schemas        # Zod validation schemas
    /constants      # Named constants
  /styles           # Global styles, tokens
```

### File Naming
- Components: PascalCase.tsx (e.g., UserProfile.tsx)
- Utils/services: camelCase.ts (e.g., formatDate.ts)
- Types: camelCase.types.ts
- Tests: [filename].test.ts
- Constants: UPPER_SNAKE_CASE inside files

---

## [PATTERNS] Service Layer
Route handler -> validate input -> check auth -> call service -> return response.
Services live in /lib/services/. One service per domain entity.
Every service method: validates with Zod, executes DB call, handles errors with AppError class.

## [PATTERNS] Error Handling
Custom AppError class with code + cause + safe input subset.
Server actions return { success, data/error } shape.
Catch Zod errors separately from AppError from unexpected.
Log full error server-side, sanitized message client-side.

## [PATTERNS] Supabase Client
Server: createServerClient from @supabase/ssr with cookies.
Client: createBrowserClient from @supabase/ssr.
Never use service role key in client code.

## [PATTERNS] React Components
Small, typed, single-responsibility. Props interface always defined.
Server Components by default. Client only for interactivity/hooks.
Max 150 lines. Composition over prop drilling.

## [PATTERNS] Async Data Loading
Server Component with async/await (preferred).
loading.tsx for Suspense boundary. error.tsx for Error boundary.
Every page handles: loading (skeleton), error (retry), empty (CTA).

## [PATTERNS] Forms
React Hook Form + Zod resolver.
Validation on blur + submit. Inline errors per field.
Submit button disabled during processing with loading text.

## [TESTING] Patterns
Naming: should_[behavior]_when_[condition]
Unit: pure functions, services. Integration: API routes, server actions.
Mock external services, not internal modules.
Each test independent, clean up after.

## [SECURITY] Input Validation
Zod schema on every server boundary.
Define schema -> infer type -> validate at boundary.

## [NAMING] Conventions
Components=PascalCase, Hooks=use+camelCase, Services=camelCase+verb,
Types=PascalCase, Constants=UPPER_SNAKE_CASE, DB tables=snake_case plural,
DB columns=snake_case, Env vars=UPPER_SNAKE_CASE with prefix.
