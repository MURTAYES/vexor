# Phase 1: Server Foundation & Auth - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-02
**Phase:** 1-server-foundation-auth
**Areas discussed:** Directory Structure

---

## Directory Structure

| Option | Description | Selected |
|--------|-------------|----------|
| (Recommended) Feature-based | Group by domain (src/features/auth, src/features/products). Keeps related logic together and scales well. | |
| MVC | Group by layer (src/controllers, src/models, src/routes). Simpler and common for smaller APIs. | ✓ |
| You decide | Use whatever is best practice for Express in 2026. | |

**User's choice:** MVC — Group by layer (src/controllers, src/models, src/routes). Simpler and common for smaller APIs.
**Notes:** None

---

## the agent's Discretion

Logging approach (Winston vs Pino vs console), CORS origin setup, Token expiry (1h vs 7d), Setup of CLI seed script.

## Deferred Ideas

None
