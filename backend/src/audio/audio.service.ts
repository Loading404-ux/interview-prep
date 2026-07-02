import { verifyToken } from "@clerk/backend"
import { Injectable } from "@nestjs/common"
import { WsException } from "@nestjs/websockets"
import type { Socket } from "socket.io"
import { AuthService } from "src/auth/auth.service"
import type { AudioChunkPayload } from "./audio.types"
import { AudioPipelineService } from "./audio-pipeline.service"
import { AUDIO_EVENTS } from "./audio.events"
import type { Server } from "socket.io"

const WINDOW_MS = 1000
const MAX_BYTES_PER_WINDOW = 1000000
const MAX_CHUNKS_PER_WINDOW = 8
const MAX_CHUNK_BYTES = 400000

type RateState = {
    windowStart: number
    bytes: number
    chunks: number
}

@Injectable()
export class AudioService {
    private readonly rateState = new Map<string, RateState>()
    private server: Server | null = null

    constructor(
        private readonly authService: AuthService,
        private readonly pipelineService: AudioPipelineService
    ) { }

    setServer(server: Server) {
        this.server = server
    }

    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth?.token
            if (!token) {
                client.disconnect()
                return
            }

            const payload = await verifyToken(token, {
                secretKey: process.env.CLERK_SECRET_KEY!,
            })

            const user = await this.authService.getOrCreateUserFromToken(payload.sub)
            client.data.user = user
            client.data.userId = user.id
        } catch {
            client.disconnect()
        }
    }

    handleDisconnect(client: Socket) {
        this.rateState.delete(client.id)
        if (client.data.audioSessionId) {
            this.pipelineService.detachClient(client.data.audioSessionId, client.id)
        }
    }

    joinSession(client: Socket, sessionId: string) {
        if (!client.data.userId) {
            throw new WsException("Unauthorized")
        }

        if (!sessionId) {
            throw new WsException("sessionId is required")
        }

        client.data.audioSessionId = sessionId
        client.join(`audio_session:${sessionId}`)
        this.pipelineService.attachClient(sessionId, client.id, (event, payload) => {
            this.server?.to(`audio_session:${sessionId}`).emit(event, payload)
        })
        return { joined: true }
    }

    handleChunk(client: Socket, payload: AudioChunkPayload) {
        if (!client.data.userId) {
            throw new WsException("Unauthorized")
        }

        const chunkSize = this.getChunkSize(payload.chunk)
        if (chunkSize > MAX_CHUNK_BYTES) {
            throw new WsException("Chunk too large")
        }

        this.enforceRateLimit(client.id, chunkSize)

        const buffer = this.toBuffer(payload.chunk)
        if (!buffer.length) {
            throw new WsException("Invalid audio payload")
        }

        this.pipelineService.pushChunk(payload.sessionId, buffer, (event, data) => {
            this.server?.to(`audio_session:${payload.sessionId}`).emit(event, data)
        })

        return {
            accepted: true,
            sessionId: payload.sessionId,
            bytes: chunkSize,
            timestampMs: payload.timestampMs,
        }
    }

    private getChunkSize(chunk: AudioChunkPayload["chunk"]) {
        if (Buffer.isBuffer(chunk)) return chunk.length
        if (chunk instanceof ArrayBuffer) return chunk.byteLength
        if (chunk instanceof Uint8Array) return chunk.byteLength
        return 0
    }

    private toBuffer(chunk: AudioChunkPayload["chunk"]) {
        if (Buffer.isBuffer(chunk)) return chunk
        if (chunk instanceof ArrayBuffer) return Buffer.from(chunk)
        if (chunk instanceof Uint8Array) return Buffer.from(chunk)
        return Buffer.alloc(0)
    }

    private enforceRateLimit(clientId: string, bytes: number) {
        const now = Date.now()
        const state = this.rateState.get(clientId)
        if (!state || now - state.windowStart > WINDOW_MS) {
            this.rateState.set(clientId, {
                windowStart: now,
                bytes,
                chunks: 1,
            })
            return
        }

        const nextBytes = state.bytes + bytes
        const nextChunks = state.chunks + 1

        if (nextBytes > MAX_BYTES_PER_WINDOW || nextChunks > MAX_CHUNKS_PER_WINDOW) {
            throw new WsException("Rate limit exceeded")
        }

        state.bytes = nextBytes
        state.chunks = nextChunks
    }
}
