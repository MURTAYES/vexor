---
phase: 03-react-frontend
plan: 03
type: execute
wave: 2
depends_on: [03-01]
files_modified:
  - frontend/src/store/invoiceStore.js
  - frontend/src/components/InvoiceBuilderPopup.jsx
  - frontend/src/api/orders.js
autonomous: true
requirements: [BLDR-01, BLDR-02, BLDR-03, BLDR-04, BLDR-05, BLDR-06, BLDR-07, BLDR-08, BLDR-09]
must_haves:
  truths:
    - Invoice builder lives in a Zustand store
    - Popup modal allows debounced searching
    - Sizes with 0 stock are disabled
    - Subtotal updates live
  artifacts:
    - frontend/src/store/invoiceStore.js
    - frontend/src/components/InvoiceBuilderPopup.jsx
  key_links:
    - Calls `POST /api/orders` on submit
---

<objective>
Implement the Invoice Builder Popup and its local state.

Purpose: Core workflow for creating invoices.
Output: Invoice builder modal component and Zustand store.
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
  <name>Task 1: Invoice Store</name>
  <files>frontend/src/store/invoiceStore.js</files>
  <action>
    Create Zustand store for the active invoice.
    State: `customer_name`, `customer_phone`, `customer_email`, `line_items`.
    Actions: `addItem`, `removeItem`, `updateItemQuantity`, `setCustomerDetails`, `clearInvoice`.
  </action>
  <verify>
    <automated>cat frontend/src/store/invoiceStore.js</automated>
  </verify>
  <done>Invoice state is managed globally.</done>
</task>

<task type="auto">
  <name>Task 2: Builder Popup Component</name>
  <files>frontend/src/components/InvoiceBuilderPopup.jsx, frontend/src/api/orders.js</files>
  <action>
    Build the product selection modal (BLDR-01).
    Implement debounced product search (BLDR-02).
    Display size chips for selected product. Gray out and disable out-of-stock sizes (BLDR-03).
    Show quantity input bounded by `stock_available` (BLDR-04) and special instructions field (BLDR-05).
    "Add to Invoice" commits to Zustand store (BLDR-06).
  </action>
  <verify>
    <automated>cat frontend/src/components/InvoiceBuilderPopup.jsx</automated>
  </verify>
  <done>Products can be selected and added to the invoice store.</done>
</task>

</tasks>

<verification>
Open the modal, search for a product, select a size, and add it to the state.
</verification>

<success_criteria>
Sellers can construct invoices efficiently.
</success_criteria>

<output>
Create .planning/phases/03-react-frontend/03-03-SUMMARY.md when done
</output>
