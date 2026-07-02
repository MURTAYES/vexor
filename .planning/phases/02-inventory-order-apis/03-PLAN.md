---
phase: 02-inventory-order-apis
plan: 03
type: execute
wave: 2
depends_on: [02-01, 02-02]
files_modified:
  - src/controllers/orderController.js
  - src/routes/orderRoutes.js
  - src/index.js
autonomous: true
requirements: [ORD-01, ORD-02, ORD-03, ORD-09]
must_haves:
  truths:
    - Checkout runs as an atomic Mongoose transaction
    - Subtotal/Total is computed securely on the server
    - Voiding restores stock via transaction
  artifacts:
    - src/controllers/orderController.js
    - src/routes/orderRoutes.js
  key_links:
    - MongoDB replica set session passed to all SKU operations
---

<objective>
Implement the checkout and void transactions for Orders.

Purpose: Guarantee atomic inventory deductions.
Output: POST /api/orders and POST /api/orders/:id/void endpoints.
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
  <name>Task 1: Order Transactions Controller</name>
  <files>src/controllers/orderController.js, src/routes/orderRoutes.js</files>
  <action>
    Implement ORD-01, ORD-02, ORD-03: `POST /api/orders`.
    Create a Mongoose session. Start transaction.
    Iterate over line items, fetch latest Product price (compute subtotal on server).
    For each SKU, attempt to decrement `stock_available` where `stock_available >= reqQuantity`. 
    If modifiedCount is 0, abort transaction and return 409 (ORD-03) with the specific failed SKU.
    Save Order document. Commit transaction.
    Implement ORD-09: `POST /api/orders/:id/void`. Start transaction, restore all SKU stock, change status to 'voided', commit.
    Invalidate Redis `catalog:*` cache keys using the Phase 1 helper.
  </action>
  <verify>
    <automated>node -e "require('./src/controllers/orderController.js')"</automated>
  </verify>
  <done>Transactions function properly using Mongoose sessions.</done>
</task>

<task type="auto">
  <name>Task 2: Mount Order Routes</name>
  <files>src/index.js</files>
  <action>
    Mount orderRoutes at `/api/orders` in `src/index.js`.
    Ensure endpoints are protected by `requireAuth`.
  </action>
  <verify>
    <automated>node -e "require('./src/index.js')"</automated>
  </verify>
  <done>Routes are accessible via Express.</done>
</task>

</tasks>

<verification>
Review the code to verify `session` is passed to every Mongoose call within the transaction blocks.
</verification>

<success_criteria>
Checkout decrements stock atomically and computes totals securely.
</success_criteria>

<output>
Create .planning/phases/02-inventory-order-apis/02-03-SUMMARY.md when done
</output>
