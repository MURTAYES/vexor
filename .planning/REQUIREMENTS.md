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

Requirements for Milestone v2.0: Sales, Pricing & Analytics.

### Per-Size Pricing

- [ ] **PRICE-01**: Seller can set a cost price (৳) per size when adding a product, instead of one flat base_price
- [ ] **PRICE-02**: SKU model stores `cost_price` per size record
- [ ] **PRICE-03**: Product `base_price` field becomes optional/deprecated — pricing authority moves to SKU
- [ ] **PRICE-04**: Inventory view displays cost price next to each size badge

### Restock Management

- [ ] **RSTK-01**: Restock action opens a modal/form (replaces the current click-prompt) showing current stock and cost price per size
- [ ] **RSTK-02**: Seller can update both quantity and cost price for a size during restock
- [ ] **RSTK-03**: Cost price update on restock only applies to newly added stock (historical line items retain their snapshot cost price)

### Invoice Selling Price

- [ ] **SELL-01**: When adding a jersey to an invoice, seller can set a custom selling price (defaults to cost price from SKU)
- [ ] **SELL-02**: Line item snapshot stores both `cost_price` (from SKU at sale time) and `selling_price` (seller’s input)
- [ ] **SELL-03**: Server computes line item total as `(selling_price + print_charge) × quantity`
- [ ] **SELL-04**: Server computes profit per line item as `(selling_price − cost_price) × quantity`
- [ ] **SELL-05**: Order document stores computed `total_profit` alongside `total`

### Name Printing

- [ ] **PRINT-01**: Invoice builder has a “Add Print” toggle per line item
- [ ] **PRINT-02**: When print is enabled, seller can enter `print_name` (text) and `print_number` (text)
- [ ] **PRINT-03**: When print is enabled, seller sets a `print_charge` (৳) that adds to the line item total
- [ ] **PRINT-04**: Line item snapshot stores `has_print`, `print_name`, `print_number`, `print_charge`
- [ ] **PRINT-05**: Print details render in invoice PDF (name and number below the jersey line item)
- [ ] **PRINT-06**: Print charge shown as a separate column or sub-line in the invoice PDF

### Analytics Dashboard

- [ ] **ANLYT-01**: Daily sales line chart showing revenue (total ৳ from confirmed invoices) over a date range
- [ ] **ANLYT-02**: Date range filter for all analytics widgets (today, last 7 days, last 30 days, custom range)
- [ ] **ANLYT-03**: Profit bar chart showing daily profit (sum of line item profits) over the selected date range
- [ ] **ANLYT-04**: Print stats widget — total jerseys with name print and total print charge revenue in the selected range
- [ ] **ANLYT-05**: Profit summary card — total revenue, total cost, total profit, profit margin percentage
- [ ] **ANLYT-06**: Filter profit by product, kit type, or season to drill down into profitability
- [ ] **ANLYT-07**: Analytics API endpoints with MongoDB aggregation pipelines for all dashboard data
- [ ] **ANLYT-08**: Top-selling products widget — ranked list by quantity sold in selected date range

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
| PRICE-01 | Phase 6 | Pending |
| PRICE-02 | Phase 6 | Pending |
| PRICE-03 | Phase 6 | Pending |
| PRICE-04 | Phase 6 | Pending |
| RSTK-01 | Phase 7 | Pending |
| RSTK-02 | Phase 7 | Pending |
| RSTK-03 | Phase 7 | Pending |
| SELL-01 | Phase 7 | Pending |
| SELL-02 | Phase 7 | Pending |
| SELL-03 | Phase 7 | Pending |
| SELL-04 | Phase 7 | Pending |
| SELL-05 | Phase 7 | Pending |
| PRINT-01 | Phase 8 | Pending |
| PRINT-02 | Phase 8 | Pending |
| PRINT-03 | Phase 8 | Pending |
| PRINT-04 | Phase 8 | Pending |
| PRINT-05 | Phase 8 | Pending |
| PRINT-06 | Phase 8 | Pending |
| ANLYT-01 | Phase 9 | Pending |
| ANLYT-02 | Phase 9 | Pending |
| ANLYT-03 | Phase 9 | Pending |
| ANLYT-04 | Phase 9 | Pending |
| ANLYT-05 | Phase 9 | Pending |
| ANLYT-06 | Phase 9 | Pending |
| ANLYT-07 | Phase 9 | Pending |
| ANLYT-08 | Phase 9 | Pending |

**Coverage:**
- v1 requirements: 44 total (Phases 1–5)
- v2 requirements: 26 total (Phases 6–9)
- Total mapped: 70
- Unmapped: 0 ✓

---
*Requirements defined: 2026-07-02*
*Last updated: 2026-07-10 after v2.0 milestone requirements*
