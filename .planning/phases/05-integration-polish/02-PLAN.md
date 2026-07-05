---
phase: 05-integration-polish
plan: 02
type: execute
wave: 2
depends_on: [05-01]
files_modified:
  - frontend/src/views/Dashboard.jsx
  - frontend/src/views/InventoryList.jsx
  - frontend/src/api/dashboard.js
autonomous: true
requirements: [INV-04, INV-05, VIEW-03]
must_haves:
  truths:
    - "Dashboard shows 3 stat cards: Today's Invoices, Low-Stock Alerts, Total SKUs"
    - "Low-stock badge renders yellow with text <= 3 across all inventory views"
    - "Out-of-stock badge renders red with 'Out of Stock' text across all inventory views"
  artifacts:
    - frontend/src/views/Dashboard.jsx
    - frontend/src/views/InventoryList.jsx
  key_links:
    - Dashboard uses the GET /api/dashboard/stats endpoint from Plan 1
---

<objective>
Update the frontend with low-stock polish and live dashboard counts.

Purpose: Final UI layer for seller visibility into inventory status.
Output: A polished dashboard and consistent inventory badge states.
</objective>

<execution_context>
@.agents/gsd-core/workflows/execute-plan.md
@.agents/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/05-integration-polish/05-CONTEXT.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Dashboard API Hook</name>
  <files>frontend/src/api/dashboard.js</files>
  <action>
    Create `frontend/src/api/dashboard.js` with a `useDashboardStats()` hook using `@tanstack/react-query` to fetch from `GET /api/dashboard/stats`.
  </action>
  <verify>
    <automated>cat frontend/src/api/dashboard.js</automated>
  </verify>
  <done>API hook ready.</done>
</task>

<task type="auto">
  <name>Task 2: Dashboard Stat Cards</name>
  <files>frontend/src/views/Dashboard.jsx</files>
  <action>
    Modify `frontend/src/views/Dashboard.jsx`:
    1. Import `useDashboardStats`.
    2. Add a new row above the navigation links containing 3 stat cards:
       - Today's Invoices
       - Low-Stock Alerts (highlight in #FF5500 if > 0)
       - Total SKUs
    3. Use the Brutalist design (heavy black borders, sharp corners, white background).
  </action>
  <verify>
    <automated>cat frontend/src/views/Dashboard.jsx</automated>
  </verify>
  <done>Dashboard renders live stats.</done>
</task>

<task type="auto">
  <name>Task 3: Consistent Inventory Badges</name>
  <files>frontend/src/views/InventoryList.jsx, frontend/src/components/InvoiceBuilderPopup.jsx</files>
  <action>
    Ensure `stock_available === 0` renders as an explicitly red "OUT OF STOCK" flag (INV-05).
    Ensure `stock_available > 0 && stock_available <= 3` renders as a yellow/orange warning flag (INV-04).
    
    Check `InventoryList.jsx` (which has a `SkuBadge` component) and `InvoiceBuilderPopup.jsx` (which uses size chips). Make sure these visual states are explicitly clear.
  </action>
  <verify>
    <automated>cat frontend/src/views/InventoryList.jsx</automated>
  </verify>
  <done>Badge consistency applied.</done>
</task>

</tasks>

<verification>
Check the UI in the browser. The dashboard should show counts matching the DB, and low stock items should be distinctly flagged.
</verification>

<success_criteria>
Seller has immediate visibility into critical stats and inventory warnings upon login.
</success_criteria>

<output>
Create .planning/phases/05-integration-polish/05-02-SUMMARY.md when done
</output>
