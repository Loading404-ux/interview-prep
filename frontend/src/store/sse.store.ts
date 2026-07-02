import { create } from "zustand"
import { createSseClient } from "@/lib/sse-client"

export type NotificationEvent = {
    id: string
    type: string
    message: string
    createdAt: string
    payload?: unknown
}

interface SseState {
    client: EventSource | null
    connected: boolean
    lastEventId: string | null
    notifications: NotificationEvent[]
    connect: (token?: string) => void
    disconnect: () => void
    clear: () => void
}

export const useSseStore = create<SseState>((set, get) => ({
    client: null,
    connected: false,
    lastEventId: null,
    notifications: [],

    connect: (token) => {
        if (get().client) return

        const makeId = () => {
            if (typeof crypto !== "undefined" && crypto.randomUUID) {
                return crypto.randomUUID()
            }
            return `evt_${Date.now()}_${Math.random().toString(16).slice(2)}`
        }

        const client = createSseClient({
            endpoint: "/realtime/notifications",
            token,
            onOpen: () => set({ connected: true }),
            onError: () => set({ connected: false }),
            onMessage: (event) => {
                let payload: NotificationEvent | null = null
                try {
                    payload = JSON.parse(event.data) as NotificationEvent
                } catch {
                    payload = {
                        id: makeId(),
                        type: "message",
                        message: event.data,
                        createdAt: new Date().toISOString(),
                    }
                }

                set((state) => ({
                    lastEventId: event.lastEventId || state.lastEventId,
                    notifications: [payload, ...state.notifications],
                }))
            },
        })

        set({ client })
    },

    disconnect: () => {
        const client = get().client
        if (client) client.close()
        set({ client: null, connected: false })
    },

    clear: () => set({ notifications: [] }),
}))
