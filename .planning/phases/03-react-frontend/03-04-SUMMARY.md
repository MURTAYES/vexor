# Plan 03-04 Summary: Checkout & Order Views

## Output Created
- `frontend/src/views/Checkout.jsx` — Final checkout flow.
- `frontend/src/views/InvoiceList.jsx` — View for past orders.
- `frontend/src/views/Dashboard.jsx` — Entry hub.

## Execution Details
Checkout safely computes client-side totals (visual only) and hits the Mongoose Transaction backend endpoint. It handles `409 Conflict` gracefully by surfacing the exact SKU that failed the atomic lock. Dashboard and Invoice routes are wired into the main React Router tree.
