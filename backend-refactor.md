# Backend Refactor Notes

Date: 2026-05-03
Scope: Realtime refactor (SSE notifications + audio WebSocket gateway + whisper pipeline)

## Overview
This refactor adds an SSE notification stream, introduces a dedicated audio WebSocket gateway with rate limiting, and updates auth handling to support SSE tokens passed via query params. Existing socket-based notifications are still emitted for backward compatibility.

## Workflow (Modules and Functions)
- SSE notifications
  - RealtimeModule -> SseController.stream() -> SseService.createStream(userId)
  - RealtimeService.emitNotification() -> SseService.emit(userId, event)
- Audio streaming
  - AudioGateway.handleConnection() -> AudioService.handleConnection()
  - AudioGateway.handleJoin() -> AudioService.joinSession()
  - AudioGateway.handleChunk() -> AudioService.handleChunk() -> AudioPipelineService.pushChunk()
    - AudioPipelineService waits for silence, runs ffmpeg -> whisper on temp WAV, stores transcript per session, and emits transcript_partial

## New Files
- backend/src/realtime/sse.service.ts
  - Manages per-user SSE streams and emits MessageEvent payloads.
- backend/src/realtime/sse.controller.ts
  - GET /realtime/notifications SSE endpoint, Clerk auth protected.
- backend/src/audio/audio.module.ts
  - Audio gateway module registration.
- backend/src/audio/audio.gateway.ts
  - WebSocket namespace /audio with join + chunk handlers.
- backend/src/audio/audio.service.ts
  - Auth validation on connect and in-memory rate limiting for chunks.
- backend/src/audio/audio.events.ts
  - Event names for audio join and chunk.
- backend/src/audio/audio.types.ts
  - Payload contract for audio chunks.
- backend/src/audio/audio-pipeline.service.ts
  - ffmpeg -> whisper.cpp streaming pipeline with sliding window buffering.

## Updated Files
- backend/src/common/guard/clerk-auth.guard.ts
  - Accepts token from Authorization header or query param (SSE compatible).
- backend/src/realtime/realtime.module.ts
  - Registers SSE controller + service.
- backend/src/realtime/realtime.service.ts
  - Emits notifications via SSE; still emits socket notifications when available.
- backend/src/app.module.ts
  - Registers AudioModule.
- backend/README.md
  - Realtime summary updated with SSE endpoint and audio gateway.
- README.md
  - Realtime status updated.
- backend/.env.example
  - Consolidated list of backend environment variables.

## SSE Behavior
- Endpoint: GET /realtime/notifications
- Auth: Clerk token in Authorization header or query string (?token=...)
- Payload: JSON stringified notification objects or raw text fallback handled in frontend.

## Audio WebSocket Behavior
- Namespace: /audio
- Events:
  - audio.join.v1 -> joins audio_session:{sessionId}
  - audio.chunk.v1 -> validates chunk and returns ack
- Rate limits (in-memory, per socket):
  - 1 second window
  - Max 8 chunks per window
  - Max 1,000,000 bytes per window
  - Max 400,000 bytes per chunk

## Whisper.cpp Pipeline
- Silence-based batching (timeout) before transcription.
- ffmpeg converts buffered audio to a temp WAV file.
- whisper.cpp reads the file input and returns transcript text.
- Transcript segments are stored per session and combined.
- Environment variables control binary/model paths:
  - FFMPEG_BIN
  - WHISPER_CPP_BIN
  - WHISPER_MODEL_PATH

## Follow-Ups
- Add persistence/metrics for chunk latency and drop rate.
- Replace socket notifications with SSE only once frontend wiring is complete.
