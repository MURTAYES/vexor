# Plan 03-03 Summary: Invoice Builder UI

## Output Created
- `frontend/src/store/invoiceStore.js` — Zustand store for transient invoice building.
- `frontend/src/components/InvoiceBuilderPopup.jsx` — Debounced search modal with SKU size constraints.

## Execution Details
The popup safely accesses the MongoDB text index, displays SKU availability dynamically, disables out-of-stock sizes, bounds quantity inputs, and writes to a global Zustand store.
