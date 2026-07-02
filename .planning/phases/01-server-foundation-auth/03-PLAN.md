---
phase: 01-server-foundation-auth
plan: 03
type: execute
wave: 2
depends_on: [01-01]
files_modified:
  - src/models/Product.js
  - src/models/SKU.js
  - src/controllers/catalogController.js
  - src/routes/catalogRoutes.js
  - src/index.js
autonomous: true
requirements: [PROD-07, INV-02, INFRA-03, INFRA-04]
must_haves:
  truths:
    - Authenticated users can list products, search products, and view SKU stock
    - Product searches use MongoDB text indexing
    - Responses are cached in Redis with a TTL (cache-aside)
  artifacts:
    - src/models/Product.js
    - src/models/SKU.js
    - src/controllers/catalogController.js
    - src/routes/catalogRoutes.js
  key_links:
    - Redis GET/SET within the catalog controller for cache-aside
---

<objective>
Implement the Product and SKU models and expose authenticated, read-only catalog APIs with Redis cache-aside.

Purpose: Provide inventory data for the frontend to consume.
Output: GET endpoints for products and SKUs, backed by Redis caching.
</objective>

<execution_context>
@.agents/gsd-core/workflows/execute-plan.md
@.agents/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/01-server-foundation-auth/01-CONTEXT.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Product and SKU Models</name>
  <files>src/models/Product.js, src/models/SKU.js</files>
  <action>
    Create Product model (club, season, kit type, version, image, base price, active_status).
    Create SKU model (product_id ref, size, stock_available, sku_id).
    Implement PROD-07 (partial): Add a MongoDB text index on Product (club + season).
  </action>
  <verify>
    <automated>node -e "require('./src/models/Product.js'); require('./src/models/SKU.js')"</automated>
  </verify>
  <done>Models are defined with correct schemas and indexes.</done>
</task>

<task type="auto">
  <name>Task 2: Read-Only Catalog API with Cache-Aside</name>
  <files>src/controllers/catalogController.js, src/routes/catalogRoutes.js, src/index.js</files>
  <action>
    Implement INFRA-03: Create controller with cache-aside pattern (check Redis, if miss -> check Mongo, save to Redis with TTL, return).
    Create `GET /api/products` (paginated list of active products).
    Implement PROD-07: Create `GET /api/products/search?q=` (use `$text` search).
    Implement INV-02: Create `GET /api/products/:id/skus` (returns SKUs for a product).
    Implement INFRA-04 (prep): Add a helper in catalogController to clear cache keys (e.g. `catalog:*`), which will be used by future mutation endpoints.
    Protect all routes with auth middleware.
  </action>
  <verify>
    <automated>node -e "require('./src/routes/catalogRoutes.js')"</automated>
  </verify>
  <done>Endpoints exist, query MongoDB correctly, and use Redis for caching.</done>
</task>

</tasks>

<verification>
Start server, authenticate, and curl the endpoints to verify JSON responses and Redis caching behavior.
</verification>

<success_criteria>
Catalog APIs are protected, return correct data structures, and cache results.
</success_criteria>

<output>
Create .planning/phases/01-server-foundation-auth/01-03-SUMMARY.md when done
</output>
