# Skill Registry

Generated: 2026-04-13
Project: school
Persistence mode: engram

## Convention Files

| Source | Path | Scope | Notes |
|------|------|------|------|
| Workspace instructions | .github/copilot-instructions.md | project | Next.js App Router, strict TypeScript, Tailwind v4, minimal focused changes |

## Available Skills

| Name | Source | Trigger | Path |
|------|------|------|------|
| react-19 | user | Writing React 19 components | ~/.copilot/skills/react-19/SKILL.md |
| nextjs-15 | user | Next.js App Router patterns and features | ~/.copilot/skills/nextjs-15/SKILL.md |
| typescript | user | TypeScript strict typing and patterns | ~/.copilot/skills/typescript/SKILL.md |
| tailwind-4 | user | Styling with Tailwind CSS v4 | ~/.copilot/skills/tailwind-4/SKILL.md |
| zod-4 | user | Schema validation with Zod v4 | ~/.copilot/skills/zod-4/SKILL.md |
| vitest-testing | user | Writing Vitest unit and integration tests | ~/.copilot/skills/vitest-testing/SKILL.md |
| tanstack-query | user | Managing server state with TanStack Query v5 | ~/.copilot/skills/tanstack-query/SKILL.md |
| shadcn | user | Managing shadcn/ui components and composition | ~/.copilot/skills/shadcn/SKILL.md |
| branch-pr | user | Creating or preparing a pull request | ~/.claude/skills/branch-pr/SKILL.md |
| issue-creation | user | Creating or triaging a GitHub issue | ~/.claude/skills/issue-creation/SKILL.md |
| judgment-day | user | Dual adversarial review requests | ~/.claude/skills/judgment-day/SKILL.md |

## Compact Rules

### project-nextjs-client
Applies to: `src/**/*.ts`, `src/**/*.tsx`, `src/app/**/*`, `src/app/globals.css`, `next.config.ts`

- Use TypeScript with `strict` typing. Avoid `any` unless there is a documented reason.
- Follow Next.js App Router defaults. Components are server components unless `"use client"` is required.
- Reuse the `@/*` import alias for code under `src/`.
- Keep changes small and focused. Do not reformat unrelated files.
- Keep global shell concerns in `src/app/layout.tsx` and route UI in route-level files such as `src/app/page.tsx`.
- Put global styles and design tokens in `src/app/globals.css`.
- Tailwind CSS v4 is configured through `@import "tailwindcss"` and `@theme`.
- Verify commands against `package.json` scripts before suggesting alternatives.
- Do not assume APIs, env vars, or backend services exist unless they are present in the codebase.
- There is currently no test runner configured. If tests are added, include setup and scripts in the same change.

### react-19
Applies to: `src/**/*.tsx`, React component files, hooks usage

- Never use useMemo/useCallback — React Compiler handles optimization automatically.
- Named imports only: `import { useState, useEffect } from "react"` — never `import React from "react"`.
- Components are Server by default in App Router; add `"use client"` only for state, events, or browser APIs.
- Use the `use()` hook to read promises or consume context conditionally (not possible with useContext).

### nextjs-15
Applies to: `next.config.ts`, `src/app/**/*.ts(x)`, route handlers, server actions

- App Router file conventions: `layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`.
- Route groups use `(name)/` (no URL impact); private folders use `_name/` (not routed).
- Server Actions require `"use server"` directive; define in `app/actions.ts` or inline in forms.
- Use `Promise.all([...])` for parallel data fetching; wrap slow components in `<Suspense>` for streaming.

### typescript
Applies to: all `.ts` and `.tsx` files

- Create `const NAME = {...} as const` first, then derive the type via `(typeof NAME)[keyof typeof NAME]` — never raw string unions.
- Flat interfaces only: one level deep; nested objects get their own dedicated interface.
- Never use `any` — use `unknown` for truly unknown inputs; use generics for flexible types.
- Use utility types (`Pick`, `Omit`, `Partial`, `Readonly`) instead of duplicating shapes.

### tailwind-4
Applies to: `src/app/globals.css`, Tailwind utility classes

- Import via `@import "tailwindcss"` at the top of `globals.css`; define tokens in an `@theme` block.
- Never use `var()` in className — use Tailwind semantic classes (`bg-primary` not `bg-[var(--color-primary)]`).
- Never use hex colors in className — use Tailwind color classes (`text-white` not `text-[#ffffff]`).
- Use `cn()` (clsx + tailwind-merge) for conditional or conflicting classes; skip it for purely static classes.

### zod-4
Applies to: schema validation, form validation, API request/response validation

- Breaking change from v3: use top-level `z.email()`, `z.uuid()`, `z.url()` — NOT `z.string().email()`.
- Use `z.string().min(1)` instead of `.nonempty()` (removed in v4).
- Use `safeParse()` for result-style handling (`{ success, data/error }`); `parse()` throws on failure.
- Infer types with `type User = z.infer<typeof userSchema>` — never duplicate type definitions.

### branch-pr
Applies to: pull request creation, branch preparation, release review workflows

- Every PR must link an approved issue.
- Every PR must have exactly one `type:*` label.
- Use conventional commit messages only.
- Required PR body sections include linked issue, PR type, summary, changes table, and test plan.

### issue-creation
Applies to: GitHub issue creation and triage workflows

- Use issue templates rather than blank issues.
- New issues enter `status:needs-review` and require `status:approved` before PR work.
- Questions belong in discussions, not issues.

### judgment-day
Applies to: explicit adversarial review requests

- Run two independent blind review passes in parallel.
- Synthesize only after both reviewers return.
- Re-judge after fixes; do not approve on a single review pass.

### tanstack-query
Applies to: data fetching, caching, and state management with TanStack Query v5

- Singleton QueryClient in `src/lib/query-client.ts` — reuse in browser, create fresh on every server request.
- Default options: `staleTime: 60 * 1000` (1 min), `gcTime: 5 * 60 * 1000` (5 min after unmount).
- Wrap root layout with a `QueryProvider` Client Component that includes `<ReactQueryDevtools>`.
- Query keys are arrays; mutations use `onSuccess`/`onError` for cache invalidation and error handling.

### vitest-testing
Applies to: `src/**/*.test.ts`, `src/**/*.test.tsx`, `src/**/*.spec.ts`, `src/**/*.spec.tsx`

- Configure via `vitest.config.mts` with `@vitejs/plugin-react`, `environment: 'jsdom'`, and `globals: true`.
- Global setup in `src/tests/setup.ts`: import `@testing-library/jest-dom/vitest`, call `cleanup()` after each test.
- Mock browser APIs unavailable in jsdom: `window.matchMedia`, `IntersectionObserver`, `ResizeObserver`.
- Coverage via v8 provider with `vitest --coverage`; exclude `node_modules`, `.next`, and `src/tests`.

### shadcn
Applies to: component files using shadcn/ui, `components.json`, component composition

- Use existing components via `npx shadcn@latest search` before writing custom UI.
- Compose over reinvention: dashboard = Sidebar + Card + Chart + Table; settings = Tabs + Card + forms.
- Use built-in variants (`variant="outline"`, `size="sm"`) instead of custom styles.
- Use semantic color classes (`bg-primary`, `text-muted-foreground`) — never raw values like `bg-blue-500`.
- Run all CLI commands with the project's package runner: `npx`, `pnpm dlx`, or `bunx --bun`.