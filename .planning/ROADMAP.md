# Roadmap: Vexor

## Overview

Vexor is built in 5 phases: server foundation and auth, then core inventory and invoicing APIs, the full React frontend, PDF and email pipeline, and finally polish and integration testing. Backend APIs are built first, then the frontend consumes them. PDF/email is added after the UI is functional — the invoice confirmation flow works without email initially.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Server Foundation & Auth** - Express scaffold, MongoDB/Redis connections, Mongoose models, auth flow, product/SKU read APIs, cache-aside infrastructure
- [ ] **Phase 2: Inventory & Order APIs** - Product creation with initial stock, restock, atomic stock decrement transaction, order confirmation, void, and order queries
- [ ] **Phase 3: React Frontend** - Vite + Tailwind scaffold, auth flow, inventory pages, invoice builder with jersey popup, invoice list/detail, dashboard
- [ ] **Phase 4: PDF & Email Pipeline** - @react-pdf/renderer invoice component, renderToBuffer service, PDF delivery on order confirmation, Nodemailer pool with fire-and-forget dispatch, resend email
- [ ] **Phase 5: Integration & Polish** - End-to-end flows, concurrent stock race testing, low-stock badges, error handling for all 409/500 states, email delivery visibility

## Phase Details

### Phase 1: Server Foundation & Auth
**Goal**: A running Express server with authenticated routes, database connections, Mongoose models, and read-only product/SKU APIs — the foundation everything else builds on
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, PROD-07, INV-02, INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05, INFRA-06
**Success Criteria** (what must be TRUE):
  1. Seller can log in with seeded credentials and receive an httpOnly JWT cookie
  2. Seller can log out and subsequent requests with the same token are rejected (Redis denylist)
  3. Authenticated GET /api/products returns paginated product list from MongoDB (cache-aside operational)
  4. Authenticated GET /api/products/search returns text-search results
  5. Authenticated GET /api/products/:id/skus returns stock-by-size for a product
**Plans**: TBD

### Phase 2: Inventory & Order APIs
**Goal**: Complete write APIs for products, SKUs, and orders — including the critical atomic stock decrement transaction and void/restore flow
**Depends on**: Phase 1
**Requirements**: PROD-01, PROD-02, PROD-03, PROD-04, PROD-05, PROD-06, INV-01, INV-03, ORD-01, ORD-02, ORD-03, ORD-04, ORD-09
**Success Criteria** (what must be TRUE):
  1. Seller can create a new product with initial stock per size, and SKU IDs are auto-generated in the correct format
  2. Duplicate product creation returns a friendly 409 error
  3. Seller can restock an existing SKU and the stock_available increments
  4. POST /api/orders atomically decrements stock for all line items and returns an invoice number in VX-YYYYMMDD-NNN format
  5. A stock conflict returns 409 with the specific SKU, size, and remaining stock count
  6. PATCH /api/orders/:id/void restores stock for all line items and marks the order as void
**Plans**: TBD

### Phase 3: React Frontend
**Goal**: A complete React frontend that lets the seller log in, manage inventory, build invoices with the jersey popup, and view invoice history — wired to all backend APIs
**Depends on**: Phase 2
**Requirements**: BLDR-01, BLDR-02, BLDR-03, BLDR-04, BLDR-05, BLDR-06, BLDR-07, BLDR-08, BLDR-09, VIEW-01, VIEW-02, VIEW-04, VIEW-05, VIEW-06
**Success Criteria** (what must be TRUE):
  1. Seller can log in and is redirected to the dashboard; auth state persists across page refreshes
  2. Seller can view the inventory list with filters (kit type, version, season, active status) and keyword search
  3. Seller can add a new product with image pre-upload and initial stock per size
  4. Seller can open the jersey popup, search products, select a size (out-of-stock chips are disabled), set quantity (max enforced), write a special instruction, and add to invoice
  5. Seller can fill customer fields, manage line items, and confirm the invoice — receiving a JSON response (PDF delivery added in Phase 4)
  6. Seller can view the invoice list and click into an invoice detail page showing all line item snapshots
**Plans**: TBD
**UI hint**: yes

### Phase 4: PDF & Email Pipeline
**Goal**: Invoice confirmation generates a PDF buffer and serves it to the seller; if the customer has an email, the PDF is sent as an attachment without blocking the response
**Depends on**: Phase 3
**Requirements**: ORD-05, ORD-06, ORD-07, ORD-08, ORD-10, PDF-01, PDF-02, PDF-03
**Success Criteria** (what must be TRUE):
  1. POST /api/orders returns a PDF binary with correct Content-Disposition header and filename format
  2. The PDF renders shop name, invoice number, date, customer details, line item table with jersey images, and total in ৳
  3. Special instructions render in a distinct styled box (amber background, left border accent, italic) in the PDF
  4. If customer email is provided, email is sent asynchronously and email_sent_at / email_error are tracked on the order
  5. Seller can resend email from an existing order via POST /api/orders/:id/resend-email
**Plans**: TBD

### Phase 5: Integration & Polish
**Goal**: End-to-end integration testing, dashboard metrics, low-stock indicators, error state handling, and concurrent stock race validation
**Depends on**: Phase 4
**Requirements**: INV-04, INV-05, VIEW-03
**Success Criteria** (what must be TRUE):
  1. Dashboard displays today's invoice count, low-stock alert count, and total SKU count
  2. Low-stock badge (≤ 3 units) appears on inventory list and dashboard
  3. Out-of-stock items show a visual flag in the inventory grid
  4. All 409 stock conflicts and 500 server errors surface meaningful inline messages in the UI
  5. Two concurrent invoice confirmations racing for the last unit result in one success and one 409 — no oversell
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------| 
| 1. Server Foundation & Auth | 0/0 | Not started | - |
| 2. Inventory & Order APIs | 0/0 | Not started | - |
| 3. React Frontend | 0/0 | Not started | - |
| 4. PDF & Email Pipeline | 0/0 | Not started | - |
| 5. Integration & Polish | 0/0 | Not started | - |
