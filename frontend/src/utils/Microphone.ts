export class Microphone {
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

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(t => t.stop())
      return { supported: true }
    } catch {
      return { supported: false, reason: "Microphone permission denied" }
    }
  }

  private mediaRecorder: MediaRecorder | null = null
  private audioChunks: Blob[] = []
  private stream: MediaStream | null = null
  private startTime = 0

  async startRecording() {
    if (this.mediaRecorder) throw new Error("Recording already active")

    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    const mimeType =
      MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm"

    this.audioChunks = []
    this.startTime = Date.now()

    this.mediaRecorder = new MediaRecorder(this.stream, { mimeType })
    this.mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) this.audioChunks.push(e.data)
    }

    this.mediaRecorder.start()
  }

  async stopRecording(): Promise<Blob> {
    if (!this.mediaRecorder) throw new Error("No active recording")

    const duration = Date.now() - this.startTime
    if (duration < 800) throw new Error("Recording too short")

    return new Promise(resolve => {
      this.mediaRecorder!.onstop = () => {
        const blob = new Blob(this.audioChunks, {
          type: this.mediaRecorder!.mimeType,
        })
        this.stream?.getTracks().forEach(t => t.stop())
        this.mediaRecorder = null
        this.stream = null
        resolve(blob)
      }
      this.mediaRecorder!.stop()
    })
  }
}
