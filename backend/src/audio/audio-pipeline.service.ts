import { Injectable, Logger } from "@nestjs/common"
import { spawn } from "child_process"
import { promises as fs } from "fs"
import { tmpdir } from "os"
import { join } from "path"

const SILENCE_TIMEOUT_MS = 700
const MAX_BUFFER_BYTES = 5000000

type PipelineState = {
    sessionId: string
    buffers: Buffer[]
    bufferBytes: number
    silenceTimer: NodeJS.Timeout | null
    transcriptParts: string[]
    emit: (event: string, payload: unknown) => void
    clients: Set<string>
}

@Injectable()
export class AudioPipelineService {
    private readonly logger = new Logger(AudioPipelineService.name)
    private readonly pipelines = new Map<string, PipelineState>()

    attachClient(sessionId: string, clientId: string, emit: PipelineState["emit"]) {
        const pipeline = this.getOrCreate(sessionId, emit)
        pipeline.clients.add(clientId)
    }

    detachClient(sessionId: string, clientId: string) {
        const pipeline = this.pipelines.get(sessionId)
        if (!pipeline) return

        pipeline.clients.delete(clientId)
        if (pipeline.clients.size === 0) {
            this.stop(sessionId)
        }
    }

    pushChunk(
        sessionId: string,
        chunk: Buffer,
        emit: PipelineState["emit"]
    ) {
        const pipeline = this.getOrCreate(sessionId, emit)

        pipeline.buffers.push(chunk)
        pipeline.bufferBytes += chunk.length

        while (pipeline.bufferBytes > MAX_BUFFER_BYTES && pipeline.buffers.length > 0) {
            const removed = pipeline.buffers.shift()
            if (removed) pipeline.bufferBytes -= removed.length
        }

        if (pipeline.silenceTimer) {
            clearTimeout(pipeline.silenceTimer)
        }

        pipeline.silenceTimer = setTimeout(() => {
            this.flushToWhisper(pipeline).catch((err) => {
                this.logger.error(`flush failed for ${sessionId}: ${String(err)}`)
            })
        }, SILENCE_TIMEOUT_MS)
    }

    stop(sessionId: string) {
        const pipeline = this.pipelines.get(sessionId)
        if (!pipeline) return

        if (pipeline.silenceTimer) {
            clearTimeout(pipeline.silenceTimer)
        }
        this.pipelines.delete(sessionId)
    }

    private getOrCreate(sessionId: string, emit: PipelineState["emit"]) {
        const existing = this.pipelines.get(sessionId)
        if (existing) return existing

        const pipeline: PipelineState = {
            sessionId,
            buffers: [],
            bufferBytes: 0,
            silenceTimer: null,
            transcriptParts: [],
            emit,
            clients: new Set(),
        }

        this.pipelines.set(sessionId, pipeline)
        return pipeline
    }

    private async flushToWhisper(pipeline: PipelineState) {
        if (!pipeline.buffers.length) return

        const combined = Buffer.concat(pipeline.buffers)
        pipeline.buffers = []
        pipeline.bufferBytes = 0

        const ffmpegBin = process.env.FFMPEG_BIN || "ffmpeg"
        const whisperBin = process.env.WHISPER_CPP_BIN || "./whisper.cpp/main"
        const whisperModel = process.env.WHISPER_MODEL_PATH || "./models/ggml-base.en.bin"

        const tmpBase = join(tmpdir(), `audio_${pipeline.sessionId}_${Date.now()}`)
        const wavPath = `${tmpBase}.wav`

        await this.writeWav(ffmpegBin, combined, wavPath)
        const text = await this.runWhisper(whisperBin, whisperModel, wavPath)
        await fs.unlink(wavPath).catch(() => undefined)

        const cleaned = text.trim()
        if (!cleaned) return

        pipeline.transcriptParts.push(cleaned)
        // HIGHLIGHT: transcript is stored per session and combined after each silence segment.
        const combinedTranscript = pipeline.transcriptParts.join(" ")

        pipeline.emit("transcript_partial", {
            sessionId: pipeline.sessionId,
            text: cleaned,
            combinedText: combinedTranscript,
        })
    }

    private writeWav(ffmpegBin: string, input: Buffer, wavPath: string) {
        return new Promise<void>((resolve, reject) => {
            const ffmpeg = spawn(ffmpegBin, [
                "-loglevel",
                "quiet",
                "-i",
                "pipe:0",
                "-ar",
                "16000",
                "-ac",
                "1",
                "-f",
                "wav",
                wavPath,
            ])

            ffmpeg.stdin.write(input)
            ffmpeg.stdin.end()

            ffmpeg.on("error", reject)
            ffmpeg.on("close", (code) => {
                if (code === 0) resolve()
                else reject(new Error(`ffmpeg exited with code ${code}`))
            })
        })
    }

    private runWhisper(
        whisperBin: string,
        whisperModel: string,
        wavPath: string
    ) {
        return new Promise<string>((resolve, reject) => {
            const whisper = spawn(whisperBin, [
                "-m",
                whisperModel,
                "-f",
                wavPath,
                "-l",
                "en",
            ])

            let output = ""
            whisper.stdout.on("data", (chunk) => {
                output += chunk.toString()
            })

            whisper.stderr.on("data", (chunk) => {
                this.logger.debug(`whisper: ${chunk.toString().trim()}`)
            })

            whisper.on("error", reject)
            whisper.on("close", (code) => {
                if (code === 0) resolve(output)
                else reject(new Error(`whisper exited with code ${code}`))
            })
        })
    }
}
