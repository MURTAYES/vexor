---
phase: 03-react-frontend
plan: 04
type: execute
wave: 3
depends_on: [03-03]
files_modified:
  - frontend/src/views/Checkout.jsx
  - frontend/src/views/Dashboard.jsx
  - frontend/src/views/InvoiceList.jsx
autonomous: true
requirements: [VIEW-01, VIEW-02]
must_haves:
  truths:
    - Sellers can checkout and confirm the invoice
    - Sellers can view past invoices
  artifacts:
    - frontend/src/views/Checkout.jsx
    - frontend/src/views/InvoiceList.jsx
  key_links:
    - Checkout clears Zustand store on success
---

<objective>
Implement the Checkout view and Invoice List view.

Purpose: Finalize the invoice creation process and view history.
Output: Checkout screen, Dashboard, and Invoice List.
</objective>

<execution_context>
@.agents/gsd-core/workflows/execute-plan.md
@.agents/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/03-react-frontend/03-CONTEXT.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Checkout View</name>
  <files>frontend/src/views/Checkout.jsx</files>
  <action>
    Build the main Invoice creation page.
    Display the current `invoiceStore` line items.
    Compute live subtotal client-side (BLDR-09).
    Include customer details form (BLDR-07).
    "Confirm Invoice" button calls `POST /api/orders` via React Query mutation.
    On success, clear `invoiceStore` and show success message.
    On 409 error, highlight the specific SKU that failed (using the error details).
  </action>
  <verify>
    <automated>cat frontend/src/views/Checkout.jsx</automated>
  </verify>
  <done>Checkout can be completed.</done>
</task>

<task type="auto">
  <name>Task 2: Dashboard & Invoice List</name>
  <files>frontend/src/views/Dashboard.jsx, frontend/src/views/InvoiceList.jsx</files>
  <action>
    Build Dashboard (VIEW-03 placeholders).
    Build Invoice List view showing past orders (VIEW-01).
    Build Invoice Detail view (read-only snapshot) (VIEW-02).
  </action>
  <verify>
    <automated>cat frontend/src/views/InvoiceList.jsx</automated>
  </verify>
  <done>Past invoices are viewable.</done>
</task>

</tasks>

<verification>
Complete a checkout flow and verify it appears in the Invoice List.
</verification>

<success_criteria>
Full end-to-end invoice creation and history is functional.
</success_criteria>

<output>
Create .planning/phases/03-react-frontend/03-04-SUMMARY.md when done
</output>
