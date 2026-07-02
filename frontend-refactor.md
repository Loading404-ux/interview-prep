# Frontend Refactor Notes

Date: 2026-05-03
Scope: Frontend-only refactor (hooks/services/api client/audio streaming/SSE)

## Overview
This refactor separates UI hooks from transport logic, centralizes API request behavior, adds an audio chunking utility, and introduces an SSE notification client/store. No folder moves were done beyond creating new files.

## New Files
- frontend/src/hooks/useAptitude.ts
  - Replaces useAptitudeHook with a service-driven hook.
  - Uses useClerkToken for auth and only updates store state.
- frontend/src/hooks/useDashboard.ts
  - Replaces useDashboardHook with service-driven loading.
- frontend/src/hooks/useProfile.ts
  - Replaces useProfileHook with service-driven loading.
- frontend/src/hooks/useClerkToken.ts
  - Central helper to read Clerk token and fail fast when missing.
- frontend/src/services/aptitude.service.ts
  - startAptitudeSession, submitAptitudeAnswer, completeAptitudeSession
- frontend/src/services/dashboard.service.ts
  - fetchDashboard aggregates streak/cards/calendar into a DashboardResponse.
- frontend/src/services/profile.service.ts
  - fetchProfile pulls the current profile payload.
- frontend/src/services/activity.service.ts
  - fetchActivityHistory returns the activity list.
- frontend/src/services/hr.service.ts
  - startHrSession, submitHrAnswer (multipart), completeHrSession
- frontend/src/lib/api-errors.ts
  - ApiError class, parseApiError, normalizeUnknownError for consistent errors.
- frontend/src/store/api.store.ts
  - Global API loading and lastError state for cross-screen handling.
- frontend/src/utils/AudioStreamer.ts
  - Chunked audio recorder (default 400ms) with metadata per chunk.
- frontend/src/lib/sse-client.ts
  - EventSource helper with token support and browser-only guard.
- frontend/src/store/sse.store.ts
  - Notification store with connect/disconnect/clear and message parsing.
- frontend/src/store/audioSocket.store.ts
  - Audio WebSocket store for connect/join/chunk emit.

## Updated Files
- frontend/src/hooks/useActivityLog.ts
  - Uses useClerkToken + fetchActivityHistory service.
- frontend/src/hooks/useHrInterview.ts
  - Uses useClerkToken + HR services; throws if session missing.
- frontend/src/lib/api-client.ts
  - Centralized request handling, timeouts, API errors, and loading tracking.
- frontend/src/lib/api-stream.ts
  - Stream requests follow same error/loading logic as api-client.
- frontend/src/app/dashboard/page.tsx
  - Imports useDashboard from new hook path.
- frontend/src/app/dashboard/aptitude/page.tsx
  - Imports useAptitude from new hook path.
- frontend/src/app/dashboard/profile/page.tsx
  - Imports useProfile from new hook path.
- frontend/src/app/dashboard/Main.tsx
  - Wires SSE connect/disconnect on auth state.
- frontend/src/app/dashboard/interview/page.tsx
  - Streams audio chunks via AudioStreamer + audio WS and shows partial transcripts.
- frontend/src/app/dashboard/hr-interview/page.tsx
  - Removed duplicate state declarations and fixed Tailwind class lint issues.
- frontend/src/store/useProfileStore.ts
  - Mapped profile progress response to store fields to avoid undefined access.
- frontend/index.d.ts
  - Aligned UserProfileResponse with backend profile response (progress object).

## Removed/Renamed Files
- frontend/src/hooks/useAptitudeHook.ts
  - Replaced by frontend/src/hooks/useAptitude.ts
- frontend/src/hooks/useDashboardHook.ts
  - Replaced by frontend/src/hooks/useDashboard.ts
- frontend/src/hooks/useProfileHook.ts
  - Replaced by frontend/src/hooks/useProfile.ts
- frontend/src/store/socket.store.ts
  - Replaced by frontend/src/store/audioSocket.store.ts

## API Client Behavior Changes
- Errors are now normalized to ApiError with status and optional code/details.
- Requests increment/decrement a global pending counter via useApiStore.
- Optional per-request hooks: onStart, onFinish, onError.
- Optional timeoutMs with AbortController support.
- 204 responses return undefined (typed as T).

## Audio Streaming (Chunking)
- AudioStreamer emits chunked blobs on a fixed interval (default 400ms).
- Each chunk includes metadata: timestampMs, chunkMs, mimeType.
- Separate from the existing Microphone class to keep one-shot recording intact.
- Audio WS base URL can be configured with NEXT_PUBLIC_WS_URL.

## SSE Notifications
- createSseClient builds an EventSource connection with optional token in query.
- useSseStore tracks connection state and stores notification events.
- Incoming message parsing attempts JSON; otherwise falls back to text payload.

## Wiring Status
- SSE client/store are wired in the dashboard shell.
- AudioStreamer is used in the interview flow to stream audio chunks.
- Global loading/error store is ready to power a loading bar or toast layer.

## Suggested Follow-Ups
- Render notifications in UI (SSE store is already connected).
- Stream AI responses from the backend and append to the interview UI.
- Optional: add a UI hook for useApiStore.pendingCount and lastError.
