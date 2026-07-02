## Frontend Overview

This frontend is a Next.js App Router application with Clerk auth, a REST API gateway, and SSE notifications. It renders the dashboard UI and proxies API calls to the NestJS backend.

## Key Architecture
- `src/app/*` App Router routes and layouts
- `src/routes/index.ts` API route map
- `src/lib/api-client.ts` REST client (same-origin `/api` gateway)
- `src/app/api/[...all]/route.ts` Gateway handler (auth + rate limiting + proxy)
- `src/store/audioSocket.store.ts` audio WS state and connection
- `src/store/sse.store.ts` SSE notifications store (wired in dashboard shell)
- `src/hooks/*` Feature hooks (HR, Aptitude, Coding, Profile)

## Auth Flow
- Clerk middleware protects routes in `src/proxy.ts`.
- `getToken()` is used client-side to call the API gateway.
- The gateway verifies Clerk server-side and forwards to the backend.

## Security
- Rate limiting at the API gateway in `src/app/api/[...all]/route.ts`.
- Security headers applied in `next.config.ts`.
- For cookie-based auth, add CSRF protection in the gateway handlers.

## Realtime
- SSE delivers one-way notifications from the backend.
- WebSocket is used only for audio chunk streaming.
- Next.js BFF is not used for audio streaming.

## Local Development
1. npm install
2. npm run dev

## Environment Variables
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
- BACKEND_BASE_URL (for server proxy)
- NEXT_PUBLIC_WS_URL (audio WS base, defaults to http://localhost:8000)
- RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX (optional for gateway)

## Known Gaps
- AI response streaming is not wired to UI yet.
- API gateway rate limiting is in-memory (use Redis in production).

## Refactor Tracking
See refactoring.md at the repo root for the architecture refactor plan.
