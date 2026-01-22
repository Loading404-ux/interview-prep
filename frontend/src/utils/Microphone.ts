export class Microphone {
    private mediaRecorder: MediaRecorder | null = null;
    private audioChunks: Blob[] = [];
    private stream: MediaStream | null = null;
    private startTime = 0;

    async startRecording(): Promise<void> {
        if (this.mediaRecorder) {
            throw new Error('Recording already in progress');
        }

        this.stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 44100,
            },
        });

        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
            ? 'audio/webm;codecs=opus'
            : 'audio/webm';

        this.audioChunks = [];
        this.startTime = Date.now();

        this.mediaRecorder = new MediaRecorder(this.stream, { mimeType });

        this.mediaRecorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
                this.audioChunks.push(e.data);
            }
        };
        console.log(
            "Tracks:",
            this.stream?.getAudioTracks().map(t => ({
                label: t.label,
                enabled: t.enabled,
                muted: t.muted,
            }))
        );
        this.mediaRecorder.start(1000); // flush every second
    }

    async stopRecording(): Promise<Blob> {
        if (!this.mediaRecorder) {
            throw new Error('No active recording');
        }

        const duration = Date.now() - this.startTime;
        if (duration < 800) {
            throw new Error('Recording too short');
        }

        return new Promise<Blob>((resolve) => {
            this.mediaRecorder!.onstop = () => {
                const blob = new Blob(this.audioChunks, {
                    type: this.mediaRecorder!.mimeType,
                });

                this.stream?.getTracks().forEach((t) => t.stop());
                this.mediaRecorder = null;
                this.stream = null;

                resolve(blob);
            };

            this.mediaRecorder!.stop();
        });
    }
}
