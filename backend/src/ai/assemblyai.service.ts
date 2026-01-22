import { Injectable } from "@nestjs/common";
import { AssemblyAI } from "assemblyai";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AssemblyAiService{
  private client: AssemblyAI;

  constructor(config: ConfigService) {
    this.client = new AssemblyAI({
      apiKey: config.get<string>("ASSEMBLYAI_API_KEY")!,
    });
  }

  async transcribe(filePath: string): Promise<string> {
    const transcript = await this.client.transcripts.transcribe({
      audio: filePath,
      speech_models: ["universal"],
    });

    return transcript.text ?? "";
  }
}
