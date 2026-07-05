---
phase: 04-pdf-email-pipeline
plan: 02
type: execute
wave: 1
depends_on: []
files_modified:
  - src/services/emailService.js
  - .env.example
autonomous: true
requirements: [ORD-07, ORD-08]
must_haves:
  truths:
    - "Nodemailer transporter is configured with pool: true"
    - "sendInvoiceEmail accepts an order and a PDF Buffer"
    - "Email is dispatched fire-and-forget (never blocks the caller)"
    - "email_sent_at and email_error are updated on the Order document"
  artifacts:
    - src/services/emailService.js
  key_links:
    - Order.email_sent_at and Order.email_error fields already exist in the schema
---

<objective>
Create the email dispatch service using Nodemailer.

Purpose: Send branded invoice emails with PDF attachments asynchronously.
Output: A service module that sends emails fire-and-forget and tracks delivery status on the Order.
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
  <name>Task 1: Install Nodemailer</name>
  <files>package.json</files>
  <action>
    Install `nodemailer` as a backend dependency.
  </action>
  <verify>
    <automated>npm list nodemailer</automated>
  </verify>
  <done>Dependency installed.</done>
</task>

<task type="auto">
  <name>Task 2: Email Service Implementation</name>
  <files>src/services/emailService.js, .env.example</files>
  <action>
    Create `src/services/emailService.js`:

    1. **Transporter Setup**: Create a Nodemailer transporter configured from `.env` variables (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`). Use `pool: true` for persistent SMTP connections. If SMTP vars are not set, log a warning and make `sendInvoiceEmail` a no-op (graceful degradation — don't crash the app).

    2. **`sendInvoiceEmail(order, pdfBuffer)`**: Async function that:
       - Constructs an HTML email body with inline-styled Brutalist branding (black header bar, #FF5500 accents, shop name "VEXOR", invoice number, total).
       - Attaches the PDF buffer as `vexor-invoice-{invoiceNumber}.pdf`.
       - Sends the email to `order.customer_email`.
       - On success: Updates `order.email_sent_at = new Date()` and saves.
       - On error: Updates `order.email_error = error.message` and saves. Logs error but does NOT throw (fire-and-forget).

    3. **Fire-and-Forget Pattern**: The function must never throw an unhandled error. All failures are caught, logged, and persisted to the Order document.

    Update `.env.example` with the SMTP variables.
  </action>
  <verify>
    <automated>cat src/services/emailService.js</automated>
  </verify>
  <done>Email service is functional and fault-tolerant.</done>
</task>

</tasks>

<verification>
Verify the service initializes without crashing when SMTP vars are missing (graceful degradation).
</verification>

<success_criteria>
Email service sends branded HTML emails with PDF attachments and never crashes the application.
</success_criteria>

<output>
Create .planning/phases/04-pdf-email-pipeline/04-02-SUMMARY.md when done
</output>
