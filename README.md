# Interview Prep Platform

Full-stack interview prep platform with Next.js (frontend + auth gateway) and NestJS (core backend). Auth is handled by Clerk. Notifications use SSE. Audio streaming uses a dedicated NestJS WebSocket gateway (no WebRTC/SFU).

## Architecture Overview
- **Frontend (Next.js)**: UI, Clerk auth, API proxy gateway, security headers, light rate limiting.
- **Backend (NestJS)**: Core domain services, MongoDB data, realtime events, AI integrations.
- **Realtime**: SSE for notifications; WebSocket for audio chunk streaming.
- **Transcription**: Whisper.cpp + ffmpeg planned (currently AssemblyAI for HR + Interview).

## Authentication Flow
1. Client signs in via Clerk.
2. Next.js middleware protects routes and issues API calls to `/api/*`.
3. Next.js API proxy validates Clerk and forwards to NestJS with bearer token.
4. NestJS guard verifies token and materializes user in MongoDB.
5. WebSocket connections (audio) validate Clerk token on connect.

## Realtime Flow (Current)
- **SSE** delivers one-way notifications from server to client.
- **WebSocket** handles audio chunk streaming directly to NestJS (not via Next.js BFF).

## Audio Streaming (Current)
- WebSocket carries audio chunks (300–500ms) to the NestJS audio gateway.
- SSE streams notifications; transcript streaming is planned.
- Next.js BFF is NOT used for audio streaming.

## Transcription Pipeline (Current)
- **Input**: raw audio chunks from WebSocket.
- **Processing**: ffmpeg converts buffered audio to temp WAV after silence.
- **Transcription**: Whisper.cpp CLI reads the WAV file.
- **Output**: transcript segments stored per session and streamed via WebSocket events.

## Known Bottlenecks
- Batch chunking can cut words mid-sentence.
- Running ffmpeg + Whisper CLI per request will not scale.
- In-memory interview sessions are lost on restart.

## TODO (Next Milestones)
- Add a dedicated Whisper worker service (queue + batching).
- Add transcript streaming over SSE.
- Persist interview sessions in MongoDB or Redis.

## Docs
- Backend module details: backend/architecture.md
- Backend API + changes: backend/README.md
- Frontend structure: frontend/README.md
- Refactor plan: refactoring.md

## Recent Documentation Changes
- Updated realtime architecture to SSE for notifications and WebSocket for audio.
- Removed WebRTC/SFU references (not in scope).
- Added refactoring plan reference.
