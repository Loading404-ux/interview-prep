# Backend Architecture

This document describes the current backend module layout, responsibilities, and key files so new developers can quickly understand and extend the system.

## Overview
The backend is a NestJS monolith organized by feature modules. Each module encapsulates its controller, service, repository (DB operations), DTOs, and mappers. Cross-cutting concerns like authentication, database, and AI live in dedicated infrastructure modules.

## Module Map
- **AppModule**: Root wiring and middleware. Imports all feature modules.
- **AuthModule**: Clerk auth integration, token verification, user bootstrap.
- **UserModule**: User profile and dashboard data.
- **ActivityModule**: Activity logs, contributions, and streak calendar.
- **CodingModule**: Coding questions, submissions, discussions.
- **HrModule**: HR interview sessions and AI evaluation.
- **AptitudeModule**: Aptitude sessions and scoring.
- **InterviewModule**: Resume-based interview flow (Gemini AI).
- **RealtimeModule**: Socket.io gateway for realtime events.
- **AiModule**: LLM access and speech-to-text integration.
- **DatabaseModule**: MongoDB connection and schema registration.
- **Common/**: Guards, decorators, middleware, shared providers.

## Module Details

### AuthModule
- **Purpose**: Clerk token validation and user bootstrap.
- **Key files**:
  - auth.service.ts (get or create user from Clerk)
  - common/guard/clerk-auth.guard.ts (request guard)
  - common/providers/clerk.provider.ts (Clerk client)
- **Notes**: Guard attaches `req.user` used across controllers.

### UserModule
- **Purpose**: Profile and user dashboard data.
- **Routes**:
  - POST /user/profile
  - GET /user/dashboard/cards
  - GET /user/dashboard/streak
  - GET /user/me/profile
  - GET /user/me/contributions
  - GET /user/dashboard/streak-calendar
  - PATCH /user/me/profile
  - PATCH /user/me/targets
- **Key files**:
  - user.controller.ts
  - user.service.ts
  - user-progress.service.ts
  - user.repository.ts
  - user.dto.ts
  - user.mapper.ts
- **Data**: user.schema.ts, user_metrics.schema.ts, user_achievements.schema.ts
- **Notes**: Progress and achievements are aggregated in UserProgressService.

### ActivityModule
- **Purpose**: Activity logs, contribution calendar, streak calendar.
- **Routes**:
  - GET /activity/history
- **Key files**:
  - activity.controller.ts
  - activity.service.ts
  - activity.repository.ts
  - activity.dto.ts
- **Data**: activity-log.schema.ts, daily-activity.schema.ts
- **Notes**: Uses ActivityLogType for event semantics.

### CodingModule
- **Purpose**: Coding questions, submissions, discussions, votes.
- **Routes**:
  - GET /coding/questions
  - GET /coding/question/:id
  - POST /coding/submit-solution
  - GET /coding/submission/:id
  - PATCH /coding/submission/:id/vote
  - POST /coding/discussion
  - GET /coding/discussion
  - PATCH /coding/discussion/:id/vote
- **Key files**:
  - coding.controller.ts
  - coding.service.ts
  - coding.repository.ts
  - coding.dto.ts
  - coding.mapper.ts
- **Data**: coding-questions.schema.ts, coding-submission.schema.ts, coding-discussion.schema.ts
- **Notes**: AI review updates submission verdicts and triggers activity + metrics.

### HrModule
- **Purpose**: HR mock interviews (audio, transcripts, AI evaluation).
- **Routes**:
  - POST /hr/session/start
  - POST /hr/answer/submit
  - POST /hr/session/complete
- **Key files**:
  - hr.controller.ts
  - hr.service.ts
  - hr.repository.ts
  - hr.dto.ts
  - hr.mapper.ts
- **Data**: hr-session.schema.ts, hr-questions.schema.ts
- **Notes**: AssemblyAI for transcription, AI service for evaluation.

### AptitudeModule
- **Purpose**: Aptitude sessions and scoring.
- **Routes**:
  - POST /aptitude/session/start
  - POST /aptitude/answer/submit
  - POST /aptitude/session/complete
- **Key files**:
  - aptitude.controller.ts
  - aptitude.service.ts
  - aptitude.repository.ts
  - aptitude.dto.ts
- **Data**: aptitude-session.schema.ts, aptitude-question.schema.ts

### InterviewModule
- **Purpose**: Resume-based interview flow using Gemini AI.
- **Routes**:
  - POST /interview/context/resume
  - POST /interview/answer/:sessionId
  - POST /interview/session/complete/:sessionId
- **Key files**:
  - interview.controller.ts
  - interview.service.ts
  - interview.store.ts
  - gemini.util.ts
- **Notes**: Uses in-memory session store (not persistent).

### RealtimeModule
- **Purpose**: Socket.io gateway for realtime events.
- **Key files**:
  - realtime.gateway.ts
  - realtime.service.ts
  - realtime.events.ts
- **Notes**: Auth token verified on connection and user context attached to socket.

### AiModule
- **Purpose**: LLM and ASR integrations.
- **Key files**:
  - ai.service.ts (LLM prompts + validation)
  - llm.factory.ts (provider wrapper)
  - assemblyai.service.ts

### DatabaseModule
- **Purpose**: Global Mongoose connection.
- **Key files**:
  - database.module.ts
  - config/mongo.config.service.ts

### Common
- **Purpose**: Shared guards, decorators, middleware, and providers.
- **Key files**:
  - common/guard/clerk-auth.guard.ts
  - common/guard/roles.guard.ts
  - common/decorators/roles.decorator.ts
  - common/middleware/request-logger.middleware.ts

## Request Flow (Typical)
1. Client sends request with Clerk bearer token.
2. ClerkAuthGuard validates token and attaches `req.user`.
3. Controller delegates to service.
4. Service uses repository for DB operations and mappers for API shaping.
5. Activity/Progress updates are recorded as side effects.

## Future Microservice Notes
- Break circular dependencies between User and Activity using events.
- Avoid feature modules importing each other directly; favor a contract layer.
- Move each feature to its own DB and expose via API or event bus.
- Realtime should consume events rather than call feature services directly.
