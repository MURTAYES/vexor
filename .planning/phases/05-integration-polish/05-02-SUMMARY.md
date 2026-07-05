# Plan 05-02 Summary: Frontend Dashboard & Polish

## Output Created
- `frontend/src/api/dashboard.js` — React Query hook `useDashboardStats`.
- Modified `frontend/src/views/Dashboard.jsx` — Added Brutalist stat cards.
- Modified `frontend/src/views/InventoryList.jsx` — Made `SkuBadge` explicitly show "OUT OF STOCK" or "(LOW)".
- Modified `frontend/src/components/InvoiceBuilderPopup.jsx` — Added "(OOS)" and "(LOW)" to size selector buttons.

## Execution Details
Integrated the backend stats API into the frontend Dashboard view (VIEW-03). The Dashboard now displays "Today's Invoices", "Low-Stock Alerts", and "Total SKUs" in a row of Brutalist-styled cards above the navigation links. The Low-Stock card highlights with an accent border and icon when alerts exist. Polished the inventory badges across the app to explicitly say "OUT OF STOCK" (red) or appending "(LOW)" for low stock items (yellow), making the visual flags highly visible to the seller (INV-04, INV-05).
