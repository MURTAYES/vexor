# Phase 5: Integration & Polish - Context

**Gathered:** 2026-07-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Final polish layer: implement low-stock visual indicators across the inventory UI, out-of-stock flags, and build the seller dashboard with live aggregate counts (today's invoices, low-stock alerts, total SKUs).

</domain>

<decisions>
## Implementation Decisions

### Agent's Discretion (From PRD & Best Practices)

- **Low-stock threshold**: ≤3 units per INV-04. This is already partially implemented in `InventoryList.jsx` (yellow badge when `stock_available <= 3`), but needs to be consistent across all views.
- **Out-of-stock flag**: `stock_available === 0` renders a red badge (INV-05). Already partially implemented in InventoryList SKU badges.
- **Dashboard counts (VIEW-03)**: The current `Dashboard.jsx` is a navigation hub only. It needs 3 stat cards:
  1. **Today's Invoices** — count of orders created today.
  2. **Low-Stock Alerts** — count of SKUs with `stock_available <= 3 AND stock_available > 0`.
  3. **Total SKUs** — total count of all SKUs in the system.
- **Backend endpoints**: A new `GET /api/dashboard/stats` endpoint will aggregate the counts server-side (more efficient than client-side counting).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Documentation
- `.planning/REQUIREMENTS.md` — INV-04, INV-05, VIEW-03

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `frontend/src/views/Dashboard.jsx` — Already has the navigation card layout; needs stat cards added above.
- `frontend/src/views/InventoryList.jsx` — Already has `SkuBadge` component with color coding for low/out-of-stock.

### Integration Points
- `SKU` model for aggregate queries.
- `Order` model for today's invoice count.

</code_context>

<specifics>
## Specific Ideas

- Dashboard stat cards should use the same Brutalist styling (hard borders, #FF5500 accent for alert numbers).

</specifics>

<deferred>
## Deferred Ideas

- None.

</deferred>

---

*Phase: 5-Integration & Polish*
*Context gathered: 2026-07-05*
