# Vexor

## What This Is

Vexor is a single-tenant, internal ERP for a football jersey retailer operating in Bangladesh. The only authenticated user is the shop seller (with possible 1–2 staff later, but single-account for v1). Customers are passive — they receive a PDF invoice by email but never log in. The system handles two core workflows: managing jersey inventory (products, sizes, stock levels) and creating customer invoices with PDF generation and automatic email delivery.

## Core Value

The seller can confirm an invoice and have stock atomically decremented, a PDF generated, and the customer emailed — in one action, without data inconsistency or manual steps.

## Business Context

- **Customer**: Solo football jersey retailer (Bangladeshi market, BDT currency)
- **Revenue model**: Internal tool — enables shop sales, not directly monetized
- **Success metric**: Invoices processed per day without stock errors or manual corrections
- **Strategy notes**: Single-tenant, no multi-shop ambitions for v1

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Seller login/logout with httpOnly JWT cookies + Redis denylist
- [ ] Add new jersey products (club, season, kit type, version) with initial stock per size
- [ ] Restock existing SKUs
- [ ] Jersey popup: image grid + keyword search + size chips (out-of-stock disabled)
- [ ] Invoice builder: customer fields + line items + per-item special instruction
- [ ] Quantity cap enforced client-side AND server-side (stock-floor guard)
- [ ] Confirm invoice → atomic MongoDB transaction → stock decremented
- [ ] 409 stock conflict surfaced inline on the affected line item
- [ ] PDF rendered server-side via `@react-pdf/renderer` and delivered to browser
- [ ] Auto-email PDF if customer email provided (fire-and-forget, non-blocking)
- [ ] Special instruction renders in distinct styled box in PDF
- [ ] Invoice number in `VX-YYYYMMDD-NNN` format
- [ ] SKU ID in `{ClubCode}-{SeasonCode}-{KitCode}-{VersionCode}-{Size}` format
- [ ] Invoice list with status, total, date
- [ ] Invoice detail page (read-only with line item snapshots)
- [ ] Void invoice + stock restore (full void only, no partial)
- [ ] Dashboard counts (today's invoices, low-stock alerts)
- [ ] Duplicate product prevention (unique compound index + friendly 409)
- [ ] `active_status` toggle to hide discontinued products
- [ ] Image pre-upload to Cloudinary before product form submission
- [ ] Resend email from invoice detail
- [ ] Email delivery tracking (`email_sent_at`, `email_error`) visible in invoice detail

### Out of Scope

- Public registration / customer accounts — customers are passive (receive PDF by email only)
- Multi-tenancy / multi-shop — single-tenant by design
- Partial voids / partial refunds — full void only in v1
- Real-time inventory sync (WebSockets) — poll/refresh is sufficient at this scale
- Cursor-based pagination — catalog stays under 2,000 SKUs; skip/limit is correct for v1
- Payment processing / POS integration — invoicing only, payment is offline
- Mobile app — web-first, responsive design sufficient
- Redis as inventory authority — MongoDB is sole authority; Redis is read cache only

## Context

- **Market**: Bangladeshi jersey retail — currency is BDT (৳), phone format is 01XXXXXXXXX
- **Catalog scale**: Under 2,000 SKUs realistically — skip/limit pagination is appropriate
- **Concurrency model**: MongoDB `findOneAndUpdate` with `$gte` stock-floor guard inside multi-document transactions. Redis is read cache only with graceful degradation
- **PDF pipeline**: `@react-pdf/renderer` with `renderToBuffer` — one Buffer reused for HTTP response, email attachment, and optional cloud upload
- **Email**: Nodemailer with `pool: true` for persistent SMTP connections; fire-and-forget dispatch that never blocks invoice confirmation
- **Auth**: JWT in httpOnly/Secure/SameSite=Strict cookie; Redis denylist for logout revocation; single seller account seeded via CLI script
- **Data architecture**: Three-collection split (Products for static metadata, Inventory/SKU for volatile stock counts, Orders with frozen line-item snapshots)
- **MongoDB requirement**: Replica set required even on single-node local dev (for transactions)
- **Image hosting**: Cloudinary — pre-upload on file selection returns URL before product form submit

## Design System

- **Palette**: Athletic/brutalist aesthetic — primary `#FF5500` (orange accent), secondary `#000000` (black), background `#FFFFFF` (white), surface neutral `#F2F2F2`, muted text/borders `#595959`
- **Typography**: Headline font `Oswald` (bold, italic, uppercase, tight letter-spacing) for titles and branding; UI font `Roboto Condensed` or `Inter` for data tables, labels, body copy
- **Buttons**: Sharp corners (0px border-radius) — primary `#FF5500`/white, secondary black/white, ghost transparent/black border
- **Cards/Modals**: White background, minimal hard shadows (`4px 4px 0px #E5E5E5`), brutalist aesthetic
- **Data tables**: Black header with white text, alternating white/light-gray rows
- **Invoice PDF**: Monochrome for print friendliness; digital/email version uses `#FF5500` for total and header. Standard Helvetica for PDF renderer compatibility
- **Special instruction box**: Light amber `#FFFDE7` background, left border accent (brand color), italic text — consistent between app and PDF

## Constraints

- **Tech stack**: React 18 + Vite + Tailwind CSS (frontend), Node.js 20 + Express + Mongoose + ioredis (backend) — specified and non-negotiable
- **Database**: MongoDB with replica set enabled — required for multi-document transactions
- **Validation**: Zod on server, React Hook Form on client
- **State management**: Zustand for auth + active invoice; @tanstack/react-query for server state
- **No public endpoints**: All API routes behind auth middleware except POST /api/auth/login
- **Server-side total**: Server must recompute subtotal/total from product prices at confirmation — never trust client-submitted numbers
- **Single seller**: Account provisioned via one-time CLI seed script (`scripts/createSeller.js`), no registration endpoint

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| MongoDB as sole inventory authority (not Redis) | Redis restart without AOF loses in-flight deductions; Mongo+Redis go out of sync silently | — Pending |
| `renderToBuffer` instead of `renderToStream` | Node Readable streams are single-consumption; draft's "tee" pattern was never specified and easy to ship broken | — Pending |
| JWT in httpOnly cookie (not localStorage) | localStorage readable by any XSS-injected script | — Pending |
| Text index for search (not compound index) | Compound index only supports left-anchored prefix matching, not the substring/keyword search UX requires | — Pending |
| skip/limit pagination for v1 (not cursor-based) | Catalog < 2,000 SKUs; cursor pagination adds real complexity with no benefit at this scale | — Pending |
| CLI seed script for seller (not registration endpoint) | No public registration; app inaccessible without account but no provisioning path existed in original draft | — Pending |
| Image pre-upload on file selection | Prevents holding binary on add-product form submit; returns URL string before form submission | — Pending |
| `email_sent_at: Date` + `email_error: String` (not just boolean) | Seller needs to see when email was sent and what failed | — Pending |
| Brutalist/athletic design with `#FF5500` accent | Matches jersey retail brand — sporty, bold, sharp corners, condensed typography | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-07-02 after initialization*
