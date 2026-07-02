# Refactoring Plan (Architecture-First)

This plan focuses on architectural cleanup and maintainability without moving files to new folders yet (per request). It identifies messiness and proposes internal structure improvements.

## Why Refactor (Observed Issues)

### Frontend (Next.js)
- **Hook responsibilities are mixed**: data fetching, token acquisition, side effects, and store mutations are all inside hooks (e.g., `useHrInterview`, `useAptitude`, `useDashboard`). This makes testing and reuse harder.
- **Inconsistent naming**: `useAptitudeHook` vs `useAptitude`, store files like `useHrStore.ts` but others are `*.store.ts`.
- **Socket store is tied to REST BASE_URL**: `socket.store.ts` builds the WS URL using `BASE_URL`, which is REST-specific and will break for dedicated WS endpoints.
- **No realtime channel abstraction**: SSE for notifications and WS for audio should be separate clients with their own config.
- **API client couples UI + transport**: `api-client.ts` imports `toast` and logs directly. This is a UI concern and reduces reusability.
- **Microphone only supports full-recording**: not ready for chunked streaming; no streaming audio controller.
- **Stores are feature-specific but not grouped**: there is no shared typing strategy or common store utilities.

### Backend (NestJS)
- **Realtime is used for notification envelope only**: must switch to SSE for one-way notifications.
- **Audio streaming should not go through Next.js BFF**: needs a dedicated WS gateway and a separate pipeline service.
- **Whisper + ffmpeg pipeline not implemented**: current transcription is AssemblyAI; planned pipeline will require separate worker/process control.
- **Cross-module notification usage still sparse**: not all modules emit realtime events after background processing.

## Refactor Goals
- Separate **transport** from **UI logic** (hooks should call services, not call `fetch` directly).
- Separate **SSE notifications** from **WS audio streaming** with clean clients.
- Standardize **file naming** and **module boundaries**.
- Prepare codebase for **Whisper + ffmpeg pipeline** without coupling it to controllers.

## Proposed Changes (No Folder Moves)

### 1) Hooks (src/hooks)
- **Create a hook pattern**:
  - `useXyz` should call `services/xyz.service.ts` functions.
  - Each hook only handles view-state and store updates.
- **Normalize naming**:
  - `useAptitudeHook.ts` -> `useAptitude.ts` (within current folder).
- **Remove auth boilerplate**:
  - Create `useClerkToken()` helper to avoid repeating `getToken()` in every hook.

### 2) Stores (src/store)
- **Standardize file names**:
  - Use either `*.store.ts` or `useXStore.ts` consistently.
- **Centralize store helpers**:
  - `src/store/helpers.ts` for common flags (loading/error/reset).
- **Split realtime stores**:
  - `socket.store.ts` should become `audioSocket.store.ts` for audio WS.
  - Add `sse.store.ts` for notifications.

### 3) Lib (src/lib)
- **Decouple UI from transport**:
  - `api-client.ts` should not import `toast`.
  - Create `api-errors.ts` for error formatting and let hooks decide UI messaging.
- **Add realtime clients**:
  - `sse-client.ts` for one-way notifications.
  - `audio-ws-client.ts` for audio chunk streaming.

### 4) Utils (src/utils)
- **Audio streaming utility**:
  - Add `AudioStreamer` (chunking, 300–500ms) to support live audio WS.
  - Keep `Microphone` for whole-file recording (HR uploads).

### 5) Backend (NestJS)
- **SSE for notifications**:
  - Add an SSE controller (per-user channel).
  - Replace notification socket emits with SSE writes.
- **Audio WS gateway**:
  - New `AudioGateway` with token auth in handshake.
  - No per-chunk auth.
- **Pipeline service**:
  - Add `audio-pipeline` service (ffmpeg + whisper) with a worker pool.
  - Use a sliding window buffer with overlap to prevent word cuts.
- **Rate limiting**:
  - WS rate limits for chunk frequency + payload size.
  - SSE rate limits per user.

## Immediate TODO (Top Priority)
1. Create SSE notification flow and remove socket usage for one-way notifications.
2. Create dedicated WS audio gateway with chunk rate limiting.
3. Implement `AudioStreamer` for 300–500ms chunks.
4. Create `audio-pipeline` service (ffmpeg pipe → whisper worker pool).
5. Add a per-user transcript stream channel (SSE) for live text + AI output.

## Metrics to Track
- Audio chunk latency (ms)
- Chunk drop rate
- Transcript delay (ms)
- Whisper worker queue length
- SSE delivery success rate

## Notes
- No folder moves required for now. All improvements stay within existing folders.
- Changes should be documented in root README, backend README, and frontend README.
