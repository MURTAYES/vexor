# Phase 1: Server Foundation & Auth - Context

**Gathered:** 2026-07-02
**Status:** Ready for planning

<domain>
## Phase Boundary

A running Express server with authenticated routes, database connections, Mongoose models, and read-only product/SKU APIs — the foundation everything else builds on.

</domain>

<decisions>
## Implementation Decisions

### Directory Structure
- **D-01:** Use MVC organization — Group by layer (src/controllers, src/models, src/routes). Simpler and common for smaller APIs.

### the agent's Discretion
- Logging approach (Winston vs Pino vs console)
- CORS origin setup
- Token expiry (1h vs 7d)
- Setup of CLI seed script

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
- None (Phase 1 — greenfield backend)

### Established Patterns
- MVC directory structure (src/controllers, src/models, src/routes)

### Integration Points
- MongoDB Replica Set for transactions
- Redis for JWT denylist and read cache

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 1-Server Foundation & Auth*
*Context gathered: 2026-07-02*
