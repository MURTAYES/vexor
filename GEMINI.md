<!-- GSD:project-start source:PROJECT.md -->

## Project

**Vexor**

Vexor is a single-tenant, internal ERP for a football jersey retailer operating in Bangladesh. The only authenticated user is the shop seller (with possible 1–2 staff later, but single-account for v1). Customers are passive — they receive a PDF invoice by email but never log in. The system handles two core workflows: managing jersey inventory (products, sizes, stock levels) and creating customer invoices with PDF generation and automatic email delivery.

**Core Value:** The seller can confirm an invoice and have stock atomically decremented, a PDF generated, and the customer emailed — in one action, without data inconsistency or manual steps.

### Constraints

- **Tech stack**: React 18 + Vite + Tailwind CSS (frontend), Node.js 20 + Express + Mongoose + ioredis (backend) — specified and non-negotiable
- **Database**: MongoDB with replica set enabled — required for multi-document transactions
- **Validation**: Zod on server, React Hook Form on client
- **State management**: Zustand for auth + active invoice; @tanstack/react-query for server state
- **No public endpoints**: All API routes behind auth middleware except POST /api/auth/login
- **Server-side total**: Server must recompute subtotal/total from product prices at confirmation — never trust client-submitted numbers
- **Single seller**: Account provisioned via one-time CLI seed script (`scripts/createSeller.js`), no registration endpoint

<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->

## Technology Stack

Technology stack not yet documented. Will populate after codebase mapping or first phase.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.agents/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
