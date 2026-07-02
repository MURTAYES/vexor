# Plan 02-03 Summary: Invoice Checkout & Void Transactions

## Output Created
- `src/controllers/orderController.js` — Core transaction handlers for checkout and voids.
- `src/routes/orderRoutes.js` — Routes for `/api/orders`.

## Execution Details
Checkout safely begins a session-bound transaction, verifies all stock constraints individually, and safely rolls back providing a 409 error specifying the failed SKU if oversold. Subtotals are entirely decoupled from client trust and re-computed against real DB records. Voids also leverage atomic transactions to accurately restore all SKU quantities.
