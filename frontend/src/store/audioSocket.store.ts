import { create } from "zustand"
import { io, Socket } from "socket.io-client"

const WS_BASE_URL =
    process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8000"

type AudioChunkPayload = {
    sessionId: string
    timestampMs: number
    mimeType: string
    chunkMs?: number
    chunk: ArrayBuffer
}

interface AudioSocketState {
    socket: Socket | null
    isConnected: boolean
    sessionId: string | null
    connect: (token: string) => void
    disconnect: () => void
    joinSession: (sessionId: string) => void
    sendChunk: (payload: AudioChunkPayload) => void
}

export const useAudioSocketStore = create<AudioSocketState>((set, get) => ({
    socket: null,
    isConnected: false,
    sessionId: null,

    connect: (token) => {
        if (get().socket?.connected) return

        const socket = io(`${WS_BASE_URL}/audio`, {
            auth: { token },
            transports: ["websocket"],
        })

        socket.on("connect", () => {
            set({ isConnected: true, sessionId: socket.id })
        })

        socket.on("disconnect", () => {
            set({ isConnected: false, sessionId: null })
        })

        set({ socket })
    },

    disconnect: () => {
        const socket = get().socket
        if (socket) {
            socket.disconnect()
        }
        set({ socket: null, sessionId: null, isConnected: false })
    },

    joinSession: (sessionId) => {
        const socket = get().socket
        if (!socket) return
        socket.emit("audio.join.v1", { sessionId })
    },

    sendChunk: (payload) => {
        const socket = get().socket
        if (!socket) return
        socket.emit("audio.chunk.v1", payload)
    },
}))
