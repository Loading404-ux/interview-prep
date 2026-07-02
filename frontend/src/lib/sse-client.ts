import { BASE_URL } from "@/lib/api-client"

export type SseClientOptions = {
    endpoint: string
    token?: string
    withCredentials?: boolean
    onOpen?: () => void
    onError?: (event: Event) => void
    onMessage?: (event: MessageEvent) => void
}

export function createSseClient(options: SseClientOptions): EventSource {
    if (typeof window === "undefined") {
        throw new Error("SSE is only available in the browser")
    }

    const url = new URL(`${BASE_URL}${options.endpoint}`, window.location.origin)
    if (options.token) {
        url.searchParams.set("token", options.token)
    }

    const client = new EventSource(url.toString(), {
        withCredentials: options.withCredentials,
    })

    if (options.onOpen) client.onopen = options.onOpen
    if (options.onError) client.onerror = options.onError
    if (options.onMessage) client.onmessage = options.onMessage

    return client
}
