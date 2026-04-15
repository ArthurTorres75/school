# Project Guidelines

> **Project Specs:** See [.github/project-specs.md](.github/project-specs.md) for full business context — roles, public pages, and dashboard features.

## Product Stack

### Frontend

* Next.js 15 (App Router) + React 19 + TypeScript (strict)
* UI: shadcn/ui (preset Maia) + Tailwind CSS v4

### Backend (Vercel Serverless)

* API: Next.js Route Handlers (`app/api/*`)
* Architecture: Modular services (service/repository pattern)
* ORM: Prisma (MongoDB) — never Mongoose
* Database: MongoDB (Atlas recommended)

### Cross-cutting

* Data Fetching: TanStack Query v5
* Validation: Zod v4
* Auth: NextAuth v5 (JWT + roles)

### Deployment

* Platform: Vercel (fullstack)
* No separate backend service (serverless only)

---

## Architecture

* Server Components by default; use `"use client"` only when strictly necessary
* App Router only — never Pages Router
* Use Route Handlers for backend logic under `src/app/api/*`
* Separate API layer from business logic (no logic inside route handlers)
* Keep global shell concerns in `src/app/layout.tsx` and route UI in route-level page files
* Put global styles and design tokens in `src/app/globals.css`
* Reuse the `@/*` import alias for all code under `src/`
* When introducing new folders, be intentional and keep naming consistent

---

## Backend Architecture (Serverless-first)

* Follow a modular structure inspired by NestJS:

	* Controllers → Route Handlers
	* Services → Business logic
	* Repositories → Data access
* Keep route handlers thin (no business logic)
* All validation must happen before reaching services
* Ensure all logic is stateless and serverless-compatible

---

## Code Style

### TypeScript

* `strict: true` — never use `any` or `unknown` without validation
* Use explicit types in all public functions
* Keep changes small and focused; do not reformat unrelated files

### React

* Build small and reusable components
* Use custom hooks for complex logic
* Never place business logic inside UI components

### API (IMPORTANT)

* Never write business logic inside `route.ts`
* Always call services from route handlers
* Always validate input with Zod
* Always return typed responses

---

## UI and Styling

* Always use shadcn/ui components before creating custom ones
* Use semantic tokens — never hardcode colors
* Accessible design with `aria-label` values in Spanish
* Keep rounded component styling aligned with the Maia preset
* Tailwind CSS v4 via `@import "tailwindcss"` and `@theme` in `src/app/globals.css`

---

## Internationalization

* Supported languages: Spanish (default), English
* Manage all copy centrally — never hardcode text strings

---

## Authentication

* NextAuth v5 with JWT strategy
* Include role in session: `admin` | `teacher` | `parent` | `student`

---

## Data Fetching

* Use Server Components for initial data
* Use TanStack Query for client state and mutations
* Handle errors centrally

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   └── (routes)/
├── components/
├── modules/
│   └── example/
│       ├── example.service.ts
│       ├── example.repository.ts
│       ├── example.schema.ts
│       └── route.ts
├── hooks/
├── lib/
└── types/
```

---

## Build And Test

* Install dependencies: `npm install`
* Development server: `npm run dev`
* Production build: `npm run build`
* Production start: `npm run start`
* Lint: `npm run lint`
* Unit testing: Vitest
* E2E testing: Playwright
* If test scripts are missing in `package.json`, add setup and scripts in the same change that introduces tests.

---

## Critical Rules

* Never use Mongoose
* Never use a separate backend service
* Never hardcode colors
* Never use Pages Router
* Never place business logic in UI components
* Always validate inputs with Zod
* Always keep API routes thin
* Always prioritize scalability
* Always keep code clean and maintainable
* Think multi-tenant and SaaS-first from day one
* Prefer editing existing patterns before introducing new abstractions

---

## Future Migration Strategy (IMPORTANT)

* Structure backend logic to be easily portable to NestJS
* Services must be framework-agnostic
* Avoid tight coupling to Next.js APIs inside business logic
* Keep controllers (route handlers) as adapters only

---

## Agent Notes

* Verify commands against `package.json` before suggesting alternatives
* Do not assume APIs, env vars, or backend services exist unless present in the codebase
* When introducing new structure, explain why it is needed in the change summary
* Keep project docs concise; use `README.md` for general setup and external references

---

## Skills

When working on this project, load and follow these skills:

* React components → read ~/.copilot/skills/react-19/SKILL.md
* Next.js patterns → read ~/.copilot/skills/nextjs-15/SKILL.md
* TypeScript → read ~/.copilot/skills/typescript/SKILL.md
* Styling → read ~/.copilot/skills/tailwind-4/SKILL.md
* Validation → read ~/.copilot/skills/zod-4/SKILL.md
* Data fetching → read ~/.copilot/skills/tanstack-query/SKILL.md
* Testing → read ~/.copilot/skills/vitest-testing/SKILL.md
* shadcn/ui components → read ~/.copilot/skills/shadcn/SKILL.md

---

## Memory

* Use mem_search before starting any task to recover previous context
* Use mem_save after completing significant work or decisions