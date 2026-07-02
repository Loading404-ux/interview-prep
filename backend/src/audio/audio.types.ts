export type AudioChunkPayload = {
    sessionId: string
    timestampMs: number
    mimeType: string
    chunkMs?: number
    chunk: Buffer | ArrayBuffer | Uint8Array
}
