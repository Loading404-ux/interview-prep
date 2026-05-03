## Backend Overview

This backend is a NestJS monolith organized by feature modules. Each module is responsible for its controller, service, repository (DB-only operations), DTOs, and any mapping logic. Authentication is handled via Clerk, and data is stored in MongoDB through Mongoose.

Key strengths already in place:
- Clear feature boundaries (coding, hr, aptitude, interview, user, activity).
- Consistent guard usage for protected routes.
- Repository pattern for DB reads/writes.
- AI utilities isolated behind a dedicated module.

## Tech Stack
- NestJS
- MongoDB + Mongoose
- Clerk (auth)
- Socket.io (realtime)
- AssemblyAI + LLM integrations
- Helmet + Throttler (security)
 - SSE (notifications)

## Project Structure (High Level)
- src/app.module.ts (root module)
- src/auth (Clerk auth and guard)
- src/user, src/activity, src/coding, src/hr, src/aptitude, src/interview
- src/ai (LLM + ASR)
- src/realtime (socket gateway)
- src/sse (planned notification stream)
- src/security (rate limiting)
- src/common (guards, decorators, middleware)
- src/schema (Mongoose schemas)

## Environment Variables
Set these values in your environment:
- CLERK_SECRET_KEY
- NIM_API_KEY (LLM provider)
- ASSEMBLYAI_API_KEY
- MONGO_URI or related Mongo config values
- PUBLIC_BASE_URL (optional, used for resume uploads; defaults to http://localhost:8000)
- RATE_LIMIT_TTL (optional, default 60 seconds)
- RATE_LIMIT_LIMIT (optional, default 120 requests)

## Local Development
Install and run:
1. npm install
2. npm run start:dev

## API Summary (Core)
Auth is required on protected routes via Clerk bearer token.

User
- POST /user/profile
- GET /user/dashboard/cards
- GET /user/dashboard/streak
- GET /user/me/profile
- GET /user/me/contributions
- GET /user/dashboard/streak-calendar
- PATCH /user/me/profile
- PATCH /user/me/targets

Activity
- GET /activity/history

Coding
- GET /coding/questions
- GET /coding/question/:id
- POST /coding/submit-solution
- GET /coding/submission/:id
- PATCH /coding/submission/:id/vote
- POST /coding/discussion
- GET /coding/discussion
- PATCH /coding/discussion/:id/vote

HR
- POST /hr/session/start
- POST /hr/answer/submit
- POST /hr/session/complete

Aptitude
- POST /aptitude/session/start
- POST /aptitude/answer/submit
- POST /aptitude/session/complete

Interview
- POST /interview/context/resume
- POST /interview/answer/:sessionId
- POST /interview/session/complete/:sessionId

## Recent Changes (What Was Improved)
These changes were made to improve clarity, maintainability, and correctness without breaking routes:

- Cleaned unused code in controllers/services/repositories across modules.
- Fixed user streak lookup to use userId, not clerkUserId.
- Fixed HR metrics update to avoid double-counting sessions.
- Ensured coding submissions map DTO fields correctly and set default verdicts.
- Recorded CODING_ACCEPTED activity when AI approves a solution.
- Hardened coding mappers for author and timestamp fields.
- Tightened DTO validation for target companies.
- Removed noisy console logs and stale TODOs.
- Added architecture documentation in architecture.md.
- Added realtime envelope routing and notification helpers.
- Added security module for HTTP rate limiting.
- Added helmet security headers in main.ts.
- Updated activity log typing and event naming.

## Architecture Notes
See architecture.md for a detailed module-by-module breakdown, data flow, and future microservice readiness notes.

## Planned (Next Milestones)
- SSE for one-way notifications
- Dedicated audio WebSocket gateway
- Whisper.cpp + ffmpeg pipeline for local transcription
- WebSocket action validation and rate limiting
- Persist interview sessions in MongoDB or Redis

## Refactor Tracking
See refactoring.md at the repo root for architecture refactor guidance.
