---
phase: 02-inventory-order-apis
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - package.json
  - src/index.js
  - src/controllers/productController.js
  - src/routes/productRoutes.js
autonomous: true
requirements: [PROD-01, PROD-02, PROD-03, PROD-04, PROD-05, PROD-06, INV-01, INV-03]
must_haves:
  truths:
    - Sellers can upload product images locally
    - Sellers can create products and initial SKUs are generated deterministically
    - Sellers can restock SKUs and update products
    - Catalog cache is invalidated on mutations
  artifacts:
    - src/controllers/productController.js
    - src/routes/productRoutes.js
  key_links:
    - Mutating data calls clearCacheKeys to invalidate catalog
---

<objective>
Implement product creation, image uploading, and inventory mutations.

Purpose: Allow sellers to populate their shop and manage stock.
Output: Secure POST/PUT/PATCH endpoints for products and SKUs.
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
  <name>Task 1: Image Upload Setup</name>
  <files>package.json, src/index.js, src/routes/productRoutes.js, src/controllers/productController.js</files>
  <action>
    Install multer.
    Configure multer in productRoutes.js to save to an `uploads/` directory.
    Implement PROD-03: `POST /api/products/image` endpoint that accepts an image and returns the URL.
    Update `src/index.js` to serve the `uploads/` directory statically at `/uploads`.
  </action>
  <verify>
    <automated>node -e "require('multer')"</automated>
  </verify>
  <done>Images can be uploaded and accessed via HTTP.</done>
</task>

<task type="auto">
  <name>Task 2: Product and SKU Mutations</name>
  <files>src/controllers/productController.js, src/routes/productRoutes.js</files>
  <action>
    Implement PROD-01, PROD-02: `POST /api/products`.
    Implement INV-01: In the POST controller, automatically generate the SKU ID format (e.g. BAR-2425-H-G-M) for each size provided.
    Implement PROD-06: Catch duplicate key error (code 11000) and return a friendly 409 error.
    Implement PROD-04, PROD-05: `PUT /api/products/:id` for metadata and active_status.
    Implement INV-03: `PATCH /api/skus/:id/restock` that unconditionally increments `stock_available`.
    All success paths must call `clearCacheKeys('catalog:*')` to invalidate Redis cache.
  </action>
  <verify>
    <automated>node -e "require('./src/controllers/productController.js')"</automated>
  </verify>
  <done>Product and SKU write operations are functional and invalidate cache.</done>
</task>

</tasks>

<verification>
Start server, upload an image via cURL, create a product via POST, restock a SKU via PATCH, and verify Redis cache clears.
</verification>

<success_criteria>
Sellers can create products, upload images, and restock variants.
</success_criteria>

<output>
Create .planning/phases/02-inventory-order-apis/02-01-SUMMARY.md when done
</output>
