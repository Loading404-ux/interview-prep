export class Microphone {
    private mediaRecorder: MediaRecorder | null = null;
    private audioChunks: Blob[] = [];
    private stream: MediaStream | null = null;

    constructor() { }

    async startRecording(): Promise<void> {
        if (this.mediaRecorder) {
            throw new Error("Recording already in progress");
        }
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        this.mediaRecorder = new MediaRecorder(this.stream);
        this.audioChunks = [];

        this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
            if (event.data.size > 0) {
                this.audioChunks.push(event.data);
            }
        };

        this.mediaRecorder.start();
    }

    async stopRecording(): Promise<Blob> {
        if (!this.mediaRecorder) {
            throw new Error("No active recording");
        }

        return new Promise<Blob>((resolve) => {
            this.mediaRecorder!.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, {
                    type: "audio/webm",
                });

                this.stream?.getTracks().forEach((track) => track.stop());
                this.mediaRecorder = null;
                this.stream = null;

                resolve(audioBlob);
            };

            this.mediaRecorder?.stop()
        });
    }
}
