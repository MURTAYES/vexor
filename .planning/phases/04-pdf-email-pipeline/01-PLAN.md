---
phase: 04-pdf-email-pipeline
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/services/pdfService.js
  - package.json
autonomous: true
requirements: [ORD-05, PDF-01, PDF-02, PDF-03]
must_haves:
  truths:
    - "@react-pdf/renderer is installed and functional"
    - "renderToBuffer produces a valid PDF Buffer"
    - "PDF contains shop name, invoice number, date, customer details, line item table, and total in BDT"
    - "Special instruction renders in distinct styled box (#FFFDE7 background, left accent border, italic text)"
  artifacts:
    - src/services/pdfService.js
  key_links:
    - Order model has embedded line_items with snapshot_price and special_instruction
---

<objective>
Create the PDF invoice template and rendering service using @react-pdf/renderer.

Purpose: Generate branded invoice PDFs server-side from Order documents.
Output: A service module that accepts an Order object and returns a PDF Buffer.
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
  <name>Task 1: Install @react-pdf/renderer</name>
  <files>package.json</files>
  <action>
    Install `@react-pdf/renderer` in the backend (root `package.json`, not frontend).
    This is a Node.js server-side dependency used for `renderToBuffer`.
  </action>
  <verify>
    <automated>npm list @react-pdf/renderer</automated>
  </verify>
  <done>Dependency installed.</done>
</task>

<task type="auto">
  <name>Task 2: Invoice PDF Template</name>
  <files>src/services/pdfService.js</files>
  <action>
    Create `src/services/pdfService.js` exporting an async function `generateInvoicePDF(order)`.

    The function:
    1. Uses `@react-pdf/renderer` React components (Document, Page, View, Text, Image, StyleSheet) to build the invoice layout.
    2. Calls `renderToBuffer(<InvoiceDocument order={order} />)` and returns the Buffer.

    PDF Layout (per PRD and PROJECT.md):
    - **Header**: Shop name "VEXOR" in bold, invoice number (VX-YYYYMMDD-NNN), date.
    - **Customer Details**: Name, phone, email.
    - **Line Item Table**: Columns — Item, Size, Qty, Unit Price (৳), Subtotal (৳).
      Each row shows the product name, size, quantity, snapshot_price, and line total.
    - **Special Instruction Box** (per PDF-02, PDF-03): If `special_instruction` exists on a line item, render it in a distinct box:
      - Background: `#FFFDE7` (light amber)
      - Left border: 3px solid `#FF5500` (brand accent)
      - Text: italic, with "Special Instructions" label
    - **Total Section**: Display subtotal and total in BDT (৳) with #FF5500 accent color.
    - **Footer**: "Thank you for your purchase!"

    Use standard Helvetica fonts for PDF compatibility (no custom font loading needed).
    Monochrome base with `#FF5500` accent for header and total (per PROJECT.md).
  </action>
  <verify>
    <automated>cat src/services/pdfService.js</automated>
  </verify>
  <done>PDF template renders correctly.</done>
</task>

</tasks>

<verification>
Call `generateInvoicePDF()` with a mock order object and verify the returned Buffer starts with `%PDF`.
</verification>

<success_criteria>
The PDF service produces valid, branded PDF Buffers from Order documents.
</success_criteria>

<output>
Create .planning/phases/04-pdf-email-pipeline/04-01-SUMMARY.md when done
</output>
