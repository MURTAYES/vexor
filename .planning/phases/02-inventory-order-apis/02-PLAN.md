---
phase: 02-inventory-order-apis
plan: 02
type: execute
wave: 1
depends_on: []
files_modified:
  - src/models/Order.js
autonomous: true
requirements: [ORD-04]
must_haves:
  truths:
    - Order model supports embedded snapshot line items
    - Invoice IDs generate atomically in the correct VX-YYYYMMDD-NNN format
  artifacts:
    - src/models/Order.js
  key_links:
    - Schema accurately maps to requirements
---

<objective>
Design the Order Mongoose model and invoice number generation logic.

Purpose: Foundation for atomic order confirmations.
Output: Order Mongoose model.
</objective>

<execution_context>
@.agents/gsd-core/workflows/execute-plan.md
@.agents/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/02-inventory-order-apis/02-CONTEXT.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Order Model and Invoice ID</name>
  <files>src/models/Order.js</files>
  <action>
    Create the Order schema.
    Embed line items (product_id, sku_id, size, quantity, snapshot of price at purchase time, special_instruction).
    Include customer details (name, phone, email).
    Include subtotal, total, status ('confirmed', 'voided'), email_sent_at, and email_error.
    Implement ORD-04: Implement a pre-save hook or a dedicated counter collection logic in the same file to generate the `invoice_number` as `VX-YYYYMMDD-NNN`.
  </action>
  <verify>
    <automated>node -e "require('./src/models/Order.js')"</automated>
  </verify>
  <done>Order model is valid and defines invoice generation logic.</done>
</task>

</tasks>

<verification>
Verify the Mongoose schema compiles and logic for ID generation uses atomic operations or reliable generation.
</verification>

<success_criteria>
Order schema is ready for checkout transactions.
</success_criteria>

<output>
Create .planning/phases/02-inventory-order-apis/02-02-SUMMARY.md when done
</output>
