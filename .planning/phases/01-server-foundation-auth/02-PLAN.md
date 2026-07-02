---
phase: 01-server-foundation-auth
plan: 02
type: execute
wave: 2
depends_on: [01-01]
files_modified:
  - src/models/User.js
  - src/controllers/authController.js
  - src/routes/authRoutes.js
  - src/middleware/auth.js
  - scripts/createSeller.js
  - src/index.js
autonomous: true
requirements: [AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, INFRA-05]
must_haves:
  truths:
    - User can log in and receive an httpOnly JWT cookie
    - User can log out and their token is blacklisted in Redis
    - Auth middleware protects routes and checks Redis denylist
    - Denylist degrades gracefully if Redis fails
    - Seed script can create the seller account
  artifacts:
    - src/models/User.js
    - src/controllers/authController.js
    - src/routes/authRoutes.js
    - src/middleware/auth.js
    - scripts/createSeller.js
  key_links:
    - Redis denylist check inside auth middleware
---

<objective>
Implement authentication using JWT cookies, Redis denylist, and a CLI seed script.

Purpose: Secure the API so only the seller can access it.
Output: Working login/logout routes and auth middleware.
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
  <name>Task 1: User Model and Seed Script</name>
  <files>src/models/User.js, scripts/createSeller.js</files>
  <action>
    Create User mongoose model with username and password (bcrypt hashed).
    Implement AUTH-04: Create a CLI script (scripts/createSeller.js) to seed the single seller account.
    (Discretion: Use commander or plain process.argv).
  </action>
  <verify>
    <automated>node -e "require('./src/models/User.js')"</automated>
  </verify>
  <done>Model exists and seed script is executable.</done>
</task>

<task type="auto">
  <name>Task 2: Login and Logout Endpoints (with Zod)</name>
  <files>src/controllers/authController.js, src/routes/authRoutes.js, src/index.js</files>
  <action>
    Install zod and jose. 
    Implement INFRA-05: Create Zod schema for login request body.
    Implement AUTH-01: Login controller validates credentials and sets httpOnly JWT cookie (use jose, not jsonwebtoken). Expiry 7 days (discretion). Include `jti` in token payload.
    Implement AUTH-02: Logout controller adds `jti` to Redis denylist and clears cookie.
    Hook routes up in src/index.js using MVC structure (D-01).
  </action>
  <verify>
    <automated>node -e "require('zod'); require('jose')"</automated>
  </verify>
  <done>Login and logout routes are defined and wired.</done>
</task>

<task type="auto">
  <name>Task 3: Auth Middleware with Graceful Denylist</name>
  <files>src/middleware/auth.js</files>
  <action>
    Implement AUTH-03: Create middleware that verifies JWT signature.
    Implement AUTH-05: Check Redis denylist for `jti`. If Redis throws an error, catch it, log it, and ALLOW the request (graceful degradation). If token is in denylist, return 401.
  </action>
  <verify>
    <automated>node -e "require('./src/middleware/auth.js')"</automated>
  </verify>
  <done>Middleware validates token and resiliently checks Redis.</done>
</task>

</tasks>

<verification>
Start server, create a user via seed script, log in via curl, access a protected dummy route, log out, and verify token is rejected.
</verification>

<success_criteria>
Auth flow is fully operational and resilient to Redis failure.
</success_criteria>

<output>
Create .planning/phases/01-server-foundation-auth/01-02-SUMMARY.md when done
</output>
