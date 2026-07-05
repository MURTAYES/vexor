---
phase: 05-integration-polish
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/controllers/dashboardController.js
  - src/routes/dashboardRoutes.js
  - src/index.js
autonomous: true
requirements: [VIEW-03]
must_haves:
  truths:
    - "GET /api/dashboard/stats returns today_invoices, low_stock_alerts, and total_skus"
    - "Low-stock alerts are defined as stock_available <= 3 and > 0"
    - "Today's invoices query matches orders created today (local time or UTC day start)"
  artifacts:
    - src/controllers/dashboardController.js
  key_links:
    - Uses SKU and Order models
---

<objective>
Build the backend endpoint for the seller dashboard counts.

Purpose: Provide aggregate statistics for the frontend dashboard efficiently.
Output: A new controller and route serving `{ today_invoices, low_stock_alerts, total_skus }`.
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
  <name>Task 1: Dashboard Controller</name>
  <files>src/controllers/dashboardController.js</files>
  <action>
    Create `src/controllers/dashboardController.js`.
    Implement `getDashboardStats(req, res)`:
    
    1. **today_invoices**: Count documents in `Order` where `createdAt` >= start of today (use `new Date().setHours(0,0,0,0)`).
    2. **low_stock_alerts**: Count documents in `SKU` where `stock_available <= 3` and `stock_available > 0`.
    3. **total_skus**: Count all documents in `SKU`.
    
    Run these queries concurrently using `Promise.all`.
    Return `res.json({ today_invoices, low_stock_alerts, total_skus })`.
  </action>
  <verify>
    <automated>cat src/controllers/dashboardController.js</automated>
  </verify>
  <done>Controller logic implemented efficiently.</done>
</task>

<task type="auto">
  <name>Task 2: Dashboard Routes</name>
  <files>src/routes/dashboardRoutes.js, src/index.js</files>
  <action>
    1. Create `src/routes/dashboardRoutes.js`:
       - Requires auth middleware.
       - Maps `GET /stats` to `getDashboardStats`.
    2. Modify `src/index.js`:
       - Import `dashboardRoutes`.
       - Register it at `app.use('/api/dashboard', dashboardRoutes)`.
  </action>
  <verify>
    <automated>cat src/routes/dashboardRoutes.js</automated>
  </verify>
  <done>Endpoint registered at /api/dashboard/stats.</done>
</task>

</tasks>

<verification>
Start the backend and verify GET /api/dashboard/stats returns the three count fields successfully.
</verification>

<success_criteria>
Backend provides fast, accurate counts for the dashboard.
</success_criteria>

<output>
Create .planning/phases/05-integration-polish/05-01-SUMMARY.md when done
</output>
