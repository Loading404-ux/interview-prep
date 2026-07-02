export type AudioChunkMeta = {
    timestampMs: number
    chunkMs: number
    mimeType: string
}

export type AudioChunkHandler = (chunk: Blob, meta: AudioChunkMeta) => void

export class AudioStreamer {
    static async isSupported(): Promise<{
        supported: boolean
        reason?: string
    }> {
        if (!navigator.mediaDevices?.getUserMedia) {
            return { supported: false, reason: "Browser does not support audio input" }
        }

        if (typeof MediaRecorder === "undefined") {
            return { supported: false, reason: "MediaRecorder not supported" }
        }

        return { supported: true }
    }

    private mediaRecorder: MediaRecorder | null = null
    private stream: MediaStream | null = null
    private chunkMs: number
    private startedAt = 0
    private onChunk?: AudioChunkHandler

    constructor(options?: { chunkMs?: number }) {
        this.chunkMs = options?.chunkMs ?? 400
    }

    async start(onChunk: AudioChunkHandler) {
        if (this.mediaRecorder) throw new Error("Streaming already active")

        this.onChunk = onChunk
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true })

        const mimeType =
            MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
                ? "audio/webm;codecs=opus"
                : "audio/webm"

        this.mediaRecorder = new MediaRecorder(this.stream, { mimeType })
        this.startedAt = Date.now()

        this.mediaRecorder.ondataavailable = (event) => {
            if (!event.data || event.data.size === 0) return
            const meta: AudioChunkMeta = {
                timestampMs: Date.now() - this.startedAt,
                chunkMs: this.chunkMs,
                mimeType: this.mediaRecorder?.mimeType || mimeType,
            }
            this.onChunk?.(event.data, meta)
        }

        this.mediaRecorder.start(this.chunkMs)
    }

    async stop() {
        if (!this.mediaRecorder) return

        const recorder = this.mediaRecorder
        return new Promise<void>((resolve) => {
            recorder.onstop = () => {
                this.stream?.getTracks().forEach((track) => track.stop())
                this.mediaRecorder = null
                this.stream = null
                this.onChunk = undefined
                resolve()
            }
            recorder.stop()
        })
    }
}
