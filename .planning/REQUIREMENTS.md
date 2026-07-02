# Requirements: Vexor

**Defined:** 2026-07-02
**Core Value:** The seller can confirm an invoice and have stock atomically decremented, a PDF generated, and the customer emailed — in one action, without data inconsistency or manual steps.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Authentication

- [ ] **AUTH-01**: Seller can log in with username and password via httpOnly JWT cookie
- [ ] **AUTH-02**: Seller can log out; session invalidated via Redis denylist keyed by jti
- [ ] **AUTH-03**: Auth middleware verifies JWT signature + checks Redis denylist on every authenticated request
- [ ] **AUTH-04**: Seller account provisioned via one-time CLI seed script (no public registration)
- [ ] **AUTH-05**: Redis denylist degrades gracefully (allows request if Redis is down but token is valid)

### Product Management

- [ ] **PROD-01**: Seller can add a new jersey product with club name, season, kit type (Home/Away/Third), version (General/Retro), image, and base price
- [ ] **PROD-02**: Seller can set initial stock per size (XS–XXL) when adding a product
- [ ] **PROD-03**: Image pre-uploaded on file selection to local storage (returns URL before form submission)
- [ ] **PROD-04**: Seller can edit product metadata (price, image)
- [ ] **PROD-05**: Seller can toggle active_status to hide/show discontinued products
- [ ] **PROD-06**: Duplicate product prevented by unique compound index (club + season + kit type + version) with friendly 409 error
- [ ] **PROD-07**: Seller can search products by keyword (MongoDB text index on club_country_name and season)

### Inventory / SKU

- [ ] **INV-01**: SKU ID auto-generated using deterministic composite key (ClubCode-SeasonCode-KitCode-VersionCode-Size)
- [ ] **INV-02**: Seller can view stock levels by size for any product
- [ ] **INV-03**: Seller can restock an existing SKU (unconditional increment via PATCH)
- [ ] **INV-04**: Low-stock badge displayed when stock ≤ 3 units
- [ ] **INV-05**: Out-of-stock visual flag in inventory grid

### Invoice Builder

- [ ] **BLDR-01**: Seller can open a jersey popup modal showing an image grid of active products
- [ ] **BLDR-02**: Seller can search products in the popup via debounced keyword search (300ms, ≥ 2 chars)
- [ ] **BLDR-03**: Size chips displayed per SKU — out-of-stock chips grayed out and not clickable
- [ ] **BLDR-04**: Quantity input appears for selected size, defaulting to 1, max enforced by stock_available
- [ ] **BLDR-05**: Seller can write a special instruction per line item (max 300 chars)
- [ ] **BLDR-06**: "Add to Invoice" appends item to Zustand invoice store and closes popup
- [ ] **BLDR-07**: Seller can fill customer fields (name, phone, email — email optional)
- [ ] **BLDR-08**: Seller can add, update, and remove line items before confirmation
- [ ] **BLDR-09**: Client-side subtotal and total computed live from line items

### Order Processing

- [ ] **ORD-01**: Invoice confirmation runs atomic MongoDB transaction — all SKU decrements succeed or entire transaction rolls back
- [ ] **ORD-02**: Server recomputes subtotal and total from product prices at confirmation (never trusts client numbers)
- [ ] **ORD-03**: 409 stock conflict returned with specific SKU, size, and remaining stock count
- [ ] **ORD-04**: Invoice number auto-generated in VX-YYYYMMDD-NNN format (atomic daily counter)
- [ ] **ORD-05**: PDF generated server-side via @react-pdf/renderer renderToBuffer
- [ ] **ORD-06**: PDF served as HTTP response with Content-Disposition header (filename: vexor-invoice-{invoiceNumber}.pdf)
- [ ] **ORD-07**: Email with PDF attachment sent fire-and-forget if customer email provided (never blocks response)
- [ ] **ORD-08**: Email delivery tracked with email_sent_at (Date) and email_error (String) on the order
- [ ] **ORD-09**: Seller can void an invoice — full stock restore via transaction (no partial voids)
- [ ] **ORD-10**: Seller can resend invoice email from invoice detail page

### PDF / Invoice Display

- [ ] **PDF-01**: Invoice PDF renders shop name, invoice number, date, customer details, line item table with jersey images, and total in BDT (৳)
- [ ] **PDF-02**: Special instruction renders in a distinct styled box (light amber #FFFDE7 background, left border accent, italic text, "Special Instructions" label)
- [ ] **PDF-03**: Special instruction box styling matches between in-app display and PDF render

### Views / Pages

- [ ] **VIEW-01**: Invoice list page with status, total, date, and pagination (skip/limit)
- [ ] **VIEW-02**: Invoice detail page (read-only) showing all line item snapshots and email delivery status
- [ ] **VIEW-03**: Dashboard with counts — today's invoices, low-stock alerts, total SKUs
- [ ] **VIEW-04**: Inventory list page with filter (kit type, version, season, active status) and search
- [ ] **VIEW-05**: Add product page with form + image pre-upload
- [ ] **VIEW-06**: Restock page for incrementing SKU stock

### Infrastructure

- [ ] **INFRA-01**: MongoDB connection with replica set support (required for transactions)
- [ ] **INFRA-02**: Redis client with graceful degradation (lazyConnect, error handler prevents crash)
- [ ] **INFRA-03**: Cache-aside pattern for catalog reads with configurable TTLs
- [ ] **INFRA-04**: Cache invalidation on product/SKU mutations
- [ ] **INFRA-05**: Zod validation schemas for all API request bodies
- [ ] **INFRA-06**: Startup check — fatal error if MongoDB replica set not configured

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Image Hosting

- **IMG-01**: Migrate image storage from local to Cloudinary
- **IMG-02**: Image URL migration script for existing products

### Multi-User

- **MULTI-01**: Support 1–2 additional staff accounts with shared seller role

### Analytics

- **ANLYT-01**: Sales reports by date range
- **ANLYT-02**: Top-selling products dashboard widget

## Out of Scope

| Feature | Reason |
|---------|--------|
| Public registration / customer accounts | Customers are passive — receive PDF by email only |
| Multi-tenancy / multi-shop | Single-tenant by design |
| Partial voids / partial refunds | Full void only in v1 — simplifies transaction logic |
| Real-time inventory sync (WebSockets) | Poll/refresh sufficient at this scale (< 2,000 SKUs) |
| Cursor-based pagination | Catalog under 2,000 SKUs; skip/limit is correct for v1 |
| Payment processing / POS integration | Invoicing only; payment is offline |
| Mobile app | Web-first, responsive design sufficient |
| Redis as inventory authority | MongoDB is sole authority; Redis is read cache only |
| Email queue system | Fire-and-forget sufficient for expected volume |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| AUTH-04 | Phase 1 | Pending |
| AUTH-05 | Phase 1 | Pending |
| PROD-01 | Phase 2 | Pending |
| PROD-02 | Phase 2 | Pending |
| PROD-03 | Phase 2 | Pending |
| PROD-04 | Phase 2 | Pending |
| PROD-05 | Phase 2 | Pending |
| PROD-06 | Phase 2 | Pending |
| PROD-07 | Phase 1 | Pending |
| INV-01 | Phase 2 | Pending |
| INV-02 | Phase 1 | Pending |
| INV-03 | Phase 2 | Pending |
| INV-04 | Phase 5 | Pending |
| INV-05 | Phase 5 | Pending |
| BLDR-01 | Phase 3 | Pending |
| BLDR-02 | Phase 3 | Pending |
| BLDR-03 | Phase 3 | Pending |
| BLDR-04 | Phase 3 | Pending |
| BLDR-05 | Phase 3 | Pending |
| BLDR-06 | Phase 3 | Pending |
| BLDR-07 | Phase 3 | Pending |
| BLDR-08 | Phase 3 | Pending |
| BLDR-09 | Phase 3 | Pending |
| ORD-01 | Phase 2 | Pending |
| ORD-02 | Phase 2 | Pending |
| ORD-03 | Phase 2 | Pending |
| ORD-04 | Phase 2 | Pending |
| ORD-05 | Phase 4 | Pending |
| ORD-06 | Phase 4 | Pending |
| ORD-07 | Phase 4 | Pending |
| ORD-08 | Phase 4 | Pending |
| ORD-09 | Phase 2 | Pending |
| ORD-10 | Phase 4 | Pending |
| PDF-01 | Phase 4 | Pending |
| PDF-02 | Phase 4 | Pending |
| PDF-03 | Phase 4 | Pending |
| VIEW-01 | Phase 3 | Pending |
| VIEW-02 | Phase 3 | Pending |
| VIEW-03 | Phase 5 | Pending |
| VIEW-04 | Phase 3 | Pending |
| VIEW-05 | Phase 3 | Pending |
| VIEW-06 | Phase 3 | Pending |
| INFRA-01 | Phase 1 | Pending |
| INFRA-02 | Phase 1 | Pending |
| INFRA-03 | Phase 1 | Pending |
| INFRA-04 | Phase 1 | Pending |
| INFRA-05 | Phase 1 | Pending |
| INFRA-06 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 44 total
- Mapped to phases: 44
- Unmapped: 0 ✓

---
*Requirements defined: 2026-07-02*
*Last updated: 2026-07-02 after initial definition*
