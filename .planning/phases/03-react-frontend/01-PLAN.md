---
phase: 03-react-frontend
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - frontend/package.json
  - frontend/tailwind.config.js
  - frontend/src/index.css
  - frontend/src/App.jsx
  - frontend/src/store/authStore.js
  - frontend/src/api/client.js
  - frontend/src/views/Login.jsx
autonomous: true
requirements: [AUTH-01, AUTH-02]
must_haves:
  truths:
    - Frontend is scaffolded with Vite and React
    - Tailwind CSS is configured with Brutalist theme
    - Axios client is configured to pass credentials
    - Users can log in and out using Zustand auth state
  artifacts:
    - frontend/src/App.jsx
    - frontend/src/views/Login.jsx
  key_links:
    - Backend is running on port 3000
---

<objective>
Scaffold the React application, establish the Brutalist design system, and implement Authentication.

Purpose: Foundation for the UI.
Output: Working React app with a secure login flow.
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
  <name>Task 1: Vite Scaffold and Dependencies</name>
  <files>frontend/package.json</files>
  <action>
    Use `npx -y create-vite@latest frontend --template react`.
    Install `tailwindcss`, `postcss`, `autoprefixer`.
    Install `react-router-dom`, `zustand`, `@tanstack/react-query`, `axios`, `react-hook-form`, `@hookform/resolvers`, `zod`, `lucide-react`.
    Initialize Tailwind configuration.
  </action>
  <verify>
    <automated>cd frontend && npm list react-router-dom</automated>
  </verify>
  <done>Dependencies installed and configured.</done>
</task>

<task type="auto">
  <name>Task 2: Design System & API Client</name>
  <files>frontend/tailwind.config.js, frontend/src/index.css, frontend/src/api/client.js</files>
  <action>
    Configure Tailwind with Brutalist theme: #FF5500 accent, no border-radius, hard shadows (4px 4px 0px #E5E5E5).
    Set up Google Fonts (Inter / Space Grotesk / etc as requested).
    Create `src/api/client.js` with an Axios instance pointing to `http://localhost:3000/api` and `withCredentials: true`.
  </action>
  <verify>
    <automated>cat frontend/tailwind.config.js</automated>
  </verify>
  <done>Styling and API client ready.</done>
</task>

<task type="auto">
  <name>Task 3: Auth Store & Login View</name>
  <files>frontend/src/store/authStore.js, frontend/src/views/Login.jsx, frontend/src/App.jsx</files>
  <action>
    Create Zustand store for authentication state.
    Build Login View with react-hook-form and Zod.
    Set up React Router with a ProtectedRoute wrapper in `App.jsx`.
    Implement Logout functionality in a Layout component.
  </action>
  <verify>
    <automated>cat frontend/src/App.jsx</automated>
  </verify>
  <done>User can authenticate.</done>
</task>

</tasks>

<verification>
Start the Vite dev server and log in with the admin credentials seeded in Phase 1.
</verification>

<success_criteria>
App loads, styles apply correctly, and login redirects to a protected route.
</success_criteria>

<output>
Create .planning/phases/03-react-frontend/03-01-SUMMARY.md when done
</output>
