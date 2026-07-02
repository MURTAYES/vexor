---
phase: 01-server-foundation-auth
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - package.json
  - src/index.js
  - src/config/database.js
  - src/config/redis.js
  - src/utils/logger.js
autonomous: true
requirements: [INFRA-01, INFRA-02, INFRA-06]
must_haves:
  truths:
    - Server starts and listens on a port
    - Fails to start if MongoDB replica set is not configured
    - Redis connection errors do not crash the app (graceful degradation)
  artifacts:
    - src/index.js
    - src/config/database.js
    - src/config/redis.js
  key_links:
    - MongoDB connection string verification
    - Redis lazy connect error handling
---

<objective>
Scaffold the Express server and establish resilient database connections.

Purpose: Foundation for all backend APIs.
Output: Working Express server with MongoDB replica set and Redis clients configured.
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
  <name>Task 1: Scaffold Express and Logging</name>
  <files>package.json, src/index.js, src/utils/logger.js</files>
  <action>
    Initialize package.json. Install express, cors, dotenv, and pino (discretion: Pino for fast JSON logging).
    Set up MVC structure per D-01. Create src/index.js to start Express.
    Add CORS middleware allowing localhost origins (discretion).
  </action>
  <verify>
    <automated>npm run start --dry-run || node -e "require('express')"</automated>
  </verify>
  <done>Express server can start and accept requests.</done>
</task>

<task type="auto">
  <name>Task 2: Configure MongoDB Replica Set Connection</name>
  <files>src/config/database.js, src/index.js</files>
  <action>
    Install mongoose. Create database.js to connect to MongoDB.
    Implement INFRA-01: Ensure connection options support replica sets.
    Implement INFRA-06: Add a startup check that fatally exits the process if the connected MongoDB is not a replica set (check admin command replSetGetStatus or ensure replicaSet is in the URI).
  </action>
  <verify>
    <automated>node -e "require('mongoose')"</automated>
  </verify>
  <done>Server fails fast if MongoDB is not a replica set.</done>
</task>

<task type="auto">
  <name>Task 3: Configure Redis with Graceful Degradation</name>
  <files>src/config/redis.js, src/index.js</files>
  <action>
    Install ioredis. Create redis.js.
    Implement INFRA-02: Configure Redis client with lazyConnect.
    Add error event listeners that log the error but do not crash the Node.js process (graceful degradation).
  </action>
  <verify>
    <automated>node -e "require('ioredis')"</automated>
  </verify>
  <done>Redis errors are logged but don't stop the server.</done>
</task>

</tasks>

<verification>
Ensure the server starts locally when a MongoDB replica set URI is provided.
</verification>

<success_criteria>
Express runs on port 3000, connects to Mongo, and prepares Redis.
</success_criteria>

<output>
Create .planning/phases/01-server-foundation-auth/01-01-SUMMARY.md when done
</output>
