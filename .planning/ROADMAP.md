# Roadmap: Vexor

## Overview

Vexor v2 builds on the existing inventory/invoicing system to add profit-aware sales capabilities. The milestone is built in 4 phases: schema migration and per-size pricing APIs, restock and selling price features, name printing integration, and finally the analytics dashboard. Backend changes come first (schema + API), then frontend follows.

## Phases

**Phase Numbering:**

- Continues from v1 (Phase 5 was the last v1 phase)
- Integer phases (6, 7, 8, 9): Planned milestone work

- [ ] **Phase 6: Schema Migration & Per-Size Pricing** — Migrate pricing from Product.base_price to SKU.cost_price, update product creation APIs to accept per-size pricing, update inventory views
- [ ] **Phase 7: Restock Modal & Selling Price** — Replace click-to-restock with a modal for editing stock + cost price, add custom selling price field to invoice builder, update order processing for profit calculation
- [ ] **Phase 8: Name Printing** — Add print toggle, name/number fields, and print charge to invoice builder and order processing, update PDF to render print details
- [ ] **Phase 9: Analytics Dashboard** — Build aggregation API endpoints, daily sales chart, profit bar chart, print stats widget, profit summary, filters, top-selling products

## Phase Details

### Phase 6: Schema Migration & Per-Size Pricing

**Goal**: Migrate pricing authority from Product.base_price to SKU.cost_price so each size can have its own cost price, and update the product creation flow to accept per-size pricing
**Depends on**: v1 complete
**Requirements**: PRICE-01, PRICE-02, PRICE-03, PRICE-04
**Success Criteria** (what must be TRUE):

  1. SKU model has a `cost_price` field; seller can set different cost prices per size when adding a product
  2. Product `base_price` is deprecated — the AddProduct form collects price per size, not one flat price
  3. Inventory view shows cost price next to each size badge
  4. Existing v1 data is handled gracefully (migration or fallback for SKUs without cost_price)

**Plans**: TBD

### Phase 7: Restock Modal & Selling Price

**Goal**: Replace the click-to-restock flow with a proper modal for editing stock and cost price, and add custom selling price to the invoice builder with server-side profit calculation
**Depends on**: Phase 6
**Requirements**: RSTK-01, RSTK-02, RSTK-03, SELL-01, SELL-02, SELL-03, SELL-04, SELL-05
**Success Criteria** (what must be TRUE):

  1. Clicking restock opens a modal showing current stock and cost price per size; seller can update both quantity and cost price
  2. Cost price changes on restock do NOT retroactively affect historical order line items (snapshot integrity preserved)
  3. Invoice builder shows a selling price input (defaulting to SKU cost_price); seller can override it
  4. Line item snapshot stores both `cost_price` and `selling_price`; server computes `total_profit` on the order
  5. Server recomputes totals using `selling_price` (not old `base_price`)

**Plans**: TBD

### Phase 8: Name Printing

**Goal**: Add name printing option to the invoice builder — toggle, name/number fields, print charge — and render print details in the invoice PDF
**Depends on**: Phase 7
**Requirements**: PRINT-01, PRINT-02, PRINT-03, PRINT-04, PRINT-05, PRINT-06
**Success Criteria** (what must be TRUE):

  1. Invoice builder has an "Add Print" toggle per line item; when enabled, name, number, and print charge fields appear
  2. Print charge is added to the line item total (`(selling_price + print_charge) × quantity`)
  3. Line item snapshot stores `has_print`, `print_name`, `print_number`, `print_charge`
  4. Invoice PDF renders print name and number below the jersey line item, and print charge appears as a separate column or sub-line
  5. Toggling print off clears the print fields and removes the charge

**Plans**: TBD

### Phase 9: Analytics Dashboard

**Goal**: Build a comprehensive analytics dashboard with daily sales graph, profit bar chart, print stats, profit summary, and multi-filter drill-down — all powered by MongoDB aggregation pipelines
**Depends on**: Phase 8
**Requirements**: ANLYT-01, ANLYT-02, ANLYT-03, ANLYT-04, ANLYT-05, ANLYT-06, ANLYT-07, ANLYT-08
**Success Criteria** (what must be TRUE):

  1. Dashboard shows a daily sales line chart (revenue) for the selected date range
  2. Date range filter works across all widgets (today, last 7 days, last 30 days, custom range)
  3. Profit bar chart shows daily profit (selling - cost) over the selected range
  4. Print stats widget displays total jerseys with name print and total print charge revenue
  5. Profit summary card shows total revenue, total cost, total profit, and profit margin %
  6. Seller can filter profit analysis by product, kit type, or season
  7. Top-selling products widget shows a ranked list by quantity sold

**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 6 → 7 → 8 → 9

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------| 
| 6. Schema Migration & Per-Size Pricing | 1/1 | Complete | Yes |
| 7. Restock Modal & Selling Price | 0/0 | Not started | - |
| 8. Name Printing | 0/0 | Not started | - |
| 9. Analytics Dashboard | 0/0 | Not started | - |
