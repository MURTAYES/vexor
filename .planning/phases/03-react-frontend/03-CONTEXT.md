# Phase 3: React Frontend - Context

**Gathered:** 2026-07-02
**Status:** Ready for planning

<domain>
## Phase Boundary

The frontend SPA for Vexor. This includes scaffolding Vite + React + Tailwind CSS, setting up routing, Zustand (auth/invoice state), and React Query (server state). It covers all primary views: Authentication, Dashboard, Inventory List, Product Management, Invoice Builder Popup, and Invoice List.

</domain>

<decisions>
## Implementation Decisions

### the agent's Discretion (All from PRD & Best Practices)
- **Framework & Build**: Vite + React 18 using `npm create vite@latest frontend -- --template react`.
- **Routing**: `react-router-dom` v6 for client-side routing.
- **State Management**: `zustand` for local transient state (auth session presence, active invoice builder state). `@tanstack/react-query` for server state (fetching products, SKUs, invoices).
- **Styling**: Tailwind CSS initialized with the Brutalist theme specified in the user's project prompt (Athletic/brutalist aesthetic, #FF5500 accent, 0px border-radius, hard shadows `4px 4px 0px #E5E5E5`).
- **Form Handling**: `react-hook-form` and `@hookform/resolvers/zod` for robust client-side validation reflecting server schemas.
- **API Client**: Axios or native fetch wrapped in a generic HTTP client that automatically includes `withCredentials: true` to pass the HTTP-only JWT cookie.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Documentation
- `.planning/PROJECT.md` — UI constraints and styling
- `.planning/REQUIREMENTS.md` — View and builder requirements

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Zod schemas in `src/controllers/*` (we will mirror these on the client).

### Integration Points
- Backend runs on `http://localhost:3000`. Frontend will run on `http://localhost:5173`. CORS is already configured.

</code_context>

<specifics>
## Specific Ideas

Follow the PRD exactly. The invoice builder will use a debounced search query. Out of stock sizes will be visually disabled.

</specifics>

<deferred>
## Deferred Ideas

- None.

</deferred>

---

*Phase: 3-React Frontend*
*Context gathered: 2026-07-02*
