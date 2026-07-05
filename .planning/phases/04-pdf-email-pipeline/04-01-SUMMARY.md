# Plan 04-01 Summary: PDF Invoice Template

## Output Created
- `src/services/pdfService.js` — PDF generation service using `@react-pdf/renderer`.

## Execution Details
The service exports `generateInvoicePDF(order)` which uses `renderToBuffer` to produce a PDF Buffer. The layout includes a Brutalist-branded header with `#FF5500` accent, customer details section, line item table with alternating row colors, and a prominent total section. Special instructions render in distinct `#FFFDE7` amber boxes with a left accent border and italic text (PDF-02, PDF-03). Standard Helvetica fonts ensure cross-platform compatibility.
