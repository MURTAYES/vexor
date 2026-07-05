# Phase 4: PDF & Email Pipeline - Context

**Gathered:** 2026-07-05
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase implements the generation of the Invoice PDF and the background dispatch of emails. The backend will use `@react-pdf/renderer` to generate the PDF Buffer server-side. This buffer is then served back to the frontend on checkout success (to be downloaded) and passed to Nodemailer for fire-and-forget email delivery to the customer.

</domain>

<decisions>
## Implementation Decisions

### Agent's Discretion (From PRD & Best Practices)

- **Email Provider**: The email system uses Nodemailer with `pool: true` configured via standard `.env` variables (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`), allowing the seller to plug in SendGrid, Mailgun, or even Gmail.
- **Frontend PDF Delivery**: The checkout endpoint (`POST /api/orders`) will return the PDF Buffer natively with `Content-Disposition: attachment; filename="vexor-invoice-VX-YYYYMMDD-NNN.pdf"`. The frontend checkout logic will be modified to handle a Blob response, initiate a download in the browser automatically, and then route to the dashboard.
- **Email Body Design**: The Nodemailer HTML body will not be plain text; it will feature a lightweight, inline-styled Brutalist theme matching the app (black headers, `#FF5500` accents) with the PDF attached.
- **PDF Styling**: The PDF layout will use `@react-pdf/renderer` primitives with a monochrome, print-friendly base, but utilize the brand `#FF5500` accent. The "Special Instruction" box will perfectly mimic the requested styling: `#FFFDE7` (light amber) background, left accent border, and italic text.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Documentation
- `.planning/PROJECT.md` — PDF styling rules and special instruction styling.
- `.planning/REQUIREMENTS.md` — ORD-05 through ORD-08, PDF-01 through PDF-03.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/controllers/orderController.js` — Currently has a placeholder for PDF generation and email dispatch.

### Integration Points
- `POST /api/orders` transaction MUST be extended to generate the PDF via `@react-pdf/renderer` `renderToBuffer` *after* the Mongoose transaction commits successfully.
- `GET /api/orders/:id/pdf` (Wait, checkout returns PDF directly per PRD, but we might also need an endpoint for downloading it later from the Invoice List).

</code_context>

<specifics>
## Specific Ideas

- N/A

</specifics>

<deferred>
## Deferred Ideas

- None.

</deferred>

---

*Phase: 4-PDF & Email Pipeline*
*Context gathered: 2026-07-05*
