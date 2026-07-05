# Plan 04-03 Summary: Integration & Frontend Wiring

## Output Created
- Modified `src/controllers/orderController.js` — PDF generation and email dispatch wired into checkout.
- Modified `src/routes/orderRoutes.js` — Added `GET /`, `GET /:id/pdf`, `POST /:id/resend-email`.
- Modified `src/models/Order.js` — Added `product_name` to line item snapshot.
- Modified `frontend/src/api/orders.js` — Blob response handling and auto-download.
- Modified `frontend/src/views/Checkout.jsx` — Handles Blob-based PDF response.
- Modified `frontend/src/views/InvoiceList.jsx` — PDF download buttons, email resend buttons, email status column.

## Execution Details
After the Mongoose transaction commits, the checkout controller generates the PDF via `renderToBuffer`, sets `Content-Disposition` and `Content-Type` headers, and returns the Buffer as the response body (ORD-05, ORD-06). Email is dispatched fire-and-forget using `.catch()` — never awaited, never blocks the HTTP response (ORD-07). The frontend checkout mutation now requests `responseType: 'blob'`, creates a Blob URL, and triggers an automatic download. Error responses from the Blob endpoint are parsed by reading `.text()` on the Blob. The InvoiceList now shows email delivery status and provides one-click PDF download and email resend actions (ORD-10).
