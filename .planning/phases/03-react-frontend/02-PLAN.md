---
phase: 03-react-frontend
plan: 02
type: execute
wave: 2
depends_on: [03-01]
files_modified:
  - frontend/src/views/InventoryList.jsx
  - frontend/src/views/AddProduct.jsx
  - frontend/src/api/products.js
autonomous: true
requirements: [PROD-01, PROD-02, PROD-03, PROD-04, PROD-05, INV-02, INV-03, VIEW-04, VIEW-05, VIEW-06]
must_haves:
  truths:
    - Products can be viewed in a grid
    - Product Add Form supports image pre-upload
    - SKUs can be restocked via an inline or modal action
  artifacts:
    - frontend/src/views/InventoryList.jsx
    - frontend/src/views/AddProduct.jsx
  key_links:
    - Queries use React Query for caching
---

<objective>
Build the Inventory and Product Management UI.

Purpose: Allow sellers to manage their catalog and restock.
Output: Inventory grid view, add product form, and restock actions.
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
  <name>Task 1: Product API Hooks</name>
  <files>frontend/src/api/products.js</files>
  <action>
    Create React Query hooks (`useProducts`, `useProductSkus`, `useCreateProduct`, `useRestockSku`).
  </action>
  <verify>
    <automated>cat frontend/src/api/products.js</automated>
  </verify>
  <done>Hooks are ready for components.</done>
</task>

<task type="auto">
  <name>Task 2: Inventory List View</name>
  <files>frontend/src/views/InventoryList.jsx</files>
  <action>
    Build the Inventory List page.
    Display products in a card grid using Brutalist styling.
    Implement a Restock modal/dialog to increment SKU quantities (INV-03).
  </action>
  <verify>
    <automated>cat frontend/src/views/InventoryList.jsx</automated>
  </verify>
  <done>Inventory List is functional.</done>
</task>

<task type="auto">
  <name>Task 3: Add Product View</name>
  <files>frontend/src/views/AddProduct.jsx</files>
  <action>
    Build the Add Product form with react-hook-form.
    Implement Image Pre-upload: When a file is selected, upload it immediately to `/api/products/image` and store the returned URL in the form state (PROD-03).
    Include initial stock inputs for all sizes.
  </action>
  <verify>
    <automated>cat frontend/src/views/AddProduct.jsx</automated>
  </verify>
  <done>Products can be created.</done>
</task>

</tasks>

<verification>
Add a product via the UI and verify it appears in the Inventory List.
</verification>

<success_criteria>
Sellers can fully manage their catalog visually.
</success_criteria>

<output>
Create .planning/phases/03-react-frontend/03-02-SUMMARY.md when done
</output>
