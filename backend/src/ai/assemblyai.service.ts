import { Injectable } from "@nestjs/common";
import { AssemblyAI } from "assemblyai";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AssemblyAiService {
  private client: AssemblyAI;

  constructor(config: ConfigService) {
    this.client = new AssemblyAI({
      apiKey: config.get<string>("ASSEMBLYAI_API_KEY")!,
    });
  }

  async transcribe(filePath: string): Promise<{ durationSeconds?: number, text: string }> {
    const transcript = await this.client.transcripts.transcribe({
      audio: filePath,
      speech_models: ["universal"],
    });

    return {
      durationSeconds: transcript.audio_duration
        ? Math.round(transcript.audio_duration)
        : undefined, text: transcript.text ?? ""
    };
  }
}
