---
phase: 04-pdf-email-pipeline
plan: 03
type: execute
wave: 2
depends_on: [04-01, 04-02]
files_modified:
  - src/controllers/orderController.js
  - src/routes/orderRoutes.js
  - frontend/src/views/Checkout.jsx
  - frontend/src/api/orders.js
autonomous: true
requirements: [ORD-05, ORD-06, ORD-07, ORD-10]
must_haves:
  truths:
    - "Checkout endpoint generates PDF after transaction commit and returns it as response"
    - "Content-Disposition header sets filename to vexor-invoice-{invoiceNumber}.pdf"
    - "Email is dispatched fire-and-forget after PDF generation (if customer_email exists)"
    - "GET /api/orders/:id/pdf re-generates the PDF for download from invoice detail"
    - "POST /api/orders/:id/resend-email re-sends the invoice email"
    - "Frontend checkout handles Blob response and triggers auto-download"
  artifacts:
    - src/controllers/orderController.js
    - src/routes/orderRoutes.js
    - frontend/src/views/Checkout.jsx
  key_links:
    - pdfService.generateInvoicePDF returns a Buffer
    - emailService.sendInvoiceEmail is fire-and-forget
---

<objective>
Wire the PDF and email services into the checkout flow and add download/resend endpoints.

Purpose: Complete the end-to-end invoice pipeline.
Output: Modified checkout that returns PDF, plus new endpoints for PDF re-download and email resend.
</objective>

<execution_context>
@.agents/gsd-core/workflows/execute-plan.md
@.agents/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/04-pdf-email-pipeline/04-CONTEXT.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Modify Checkout Controller</name>
  <files>src/controllers/orderController.js</files>
  <action>
    Modify the existing `checkout` function in `src/controllers/orderController.js`:

    After `await session.commitTransaction()` and cache clear:
    1. Re-fetch the saved order (with `invoice_number` populated from the pre-save hook).
    2. Call `generateInvoicePDF(order)` to get the PDF Buffer.
    3. If `customer_email` is provided, call `sendInvoiceEmail(order, pdfBuffer)` — do NOT await it (fire-and-forget via `.catch()`). (ORD-07)
    4. Set response headers:
       - `Content-Type: application/pdf`
       - `Content-Disposition: attachment; filename="vexor-invoice-{invoiceNumber}.pdf"` (ORD-06)
       - `X-Invoice-Number: {invoiceNumber}` (custom header so frontend can read it)
    5. Send the PDF Buffer as the response body: `res.end(pdfBuffer)`.

    Add a new `getOrderPdf` function:
    - Accepts `req.params.id` (order ID).
    - Fetches the order, calls `generateInvoicePDF(order)`, and returns the PDF with proper headers.
    - Returns 404 if order not found.

    Add a new `resendEmail` function (ORD-10):
    - Accepts `req.params.id` (order ID).
    - Fetches the order, validates it has a `customer_email`.
    - Calls `generateInvoicePDF(order)` then `sendInvoiceEmail(order, pdfBuffer)` (awaited this time so we can return the result).
    - Returns success/failure status.

    Add a new `getOrders` function:
    - Accepts pagination params (`page`, `limit`) from query string.
    - Returns orders sorted by `createdAt` descending.
  </action>
  <verify>
    <automated>cat src/controllers/orderController.js</automated>
  </verify>
  <done>Controller has PDF generation and email dispatch wired in.</done>
</task>

<task type="auto">
  <name>Task 2: Add New Routes</name>
  <files>src/routes/orderRoutes.js</files>
  <action>
    Add the following routes to `src/routes/orderRoutes.js`:
    - `GET /` — List orders (paginated)
    - `GET /:id/pdf` — Download invoice PDF
    - `POST /:id/resend-email` — Resend invoice email
  </action>
  <verify>
    <automated>cat src/routes/orderRoutes.js</automated>
  </verify>
  <done>Routes are registered.</done>
</task>

<task type="auto">
  <name>Task 3: Update Frontend Checkout</name>
  <files>frontend/src/views/Checkout.jsx, frontend/src/api/orders.js</files>
  <action>
    Modify `frontend/src/api/orders.js`:
    - Update the checkout mutation to set `responseType: 'blob'` on the Axios request.
    - Extract the `X-Invoice-Number` header from the response.

    Modify `frontend/src/views/Checkout.jsx`:
    - On successful checkout, create a Blob URL from the PDF response.
    - Trigger an automatic download using a hidden `<a>` element with `download` attribute.
    - Show the invoice number from the response header.
    - Then clear the invoice store and navigate to dashboard.
  </action>
  <verify>
    <automated>cat frontend/src/views/Checkout.jsx</automated>
  </verify>
  <done>Frontend auto-downloads the PDF on checkout.</done>
</task>

</tasks>

<verification>
Complete a checkout flow and verify:
1. PDF is auto-downloaded in the browser.
2. Email is dispatched (or gracefully skipped if no SMTP).
3. GET /api/orders/:id/pdf returns the PDF for a past order.
</verification>

<success_criteria>
The full invoice pipeline is operational: checkout → PDF → download → email.
</success_criteria>

<output>
Create .planning/phases/04-pdf-email-pipeline/04-03-SUMMARY.md when done
</output>
