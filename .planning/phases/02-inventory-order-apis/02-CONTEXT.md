# Phase 2: Inventory & Order APIs - Context

**Gathered:** 2026-07-02
**Status:** Ready for planning

<domain>
## Phase Boundary

The core product catalog and inventory state machine. This phase implements product creation with image uploads, dynamic SKU generation, the restock mutation, and the atomic invoice-confirmation transaction that decrements stock safely.

</domain>

<decisions>
## Implementation Decisions

### the agent's Discretion (All from PRD)
- **Image Uploads**: Use `multer` for local storage in an `/uploads` directory, served statically by Express. (PRD states local storage for v1).
- **SKU Generation**: Derive a short deterministic code from the club name (e.g., first 3 letters uppercase).
- **Order Model**: Embed line items directly within the Order document (snapshot pattern).
- **Transaction Handling**: Handle Mongoose session/transactions inline in the checkout controller to ensure atomicity.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Documentation
- `.planning/PROJECT.md` — Project context, constraints, and architecture
- `.planning/REQUIREMENTS.md` — Requirement traceability and definitions

No external specs — requirements fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/utils/logger.js` — Use for all logging.
- `src/middleware/auth.js` — Protect all mutations.

### Established Patterns
- MVC directory structure.

### Integration Points
- MongoDB Replica Set for the order confirmation transaction.
- `clearCacheKeys` from Phase 1 to invalidate Redis cache when products/SKUs mutate.

</code_context>

<specifics>
## Specific Ideas

Follow the PRD exactly.

</specifics>

<deferred>
## Deferred Ideas

- Image migration to Cloudinary (deferred to v2).

</deferred>

---

*Phase: 2-Inventory & Order APIs*
*Context gathered: 2026-07-02*
