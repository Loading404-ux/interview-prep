import { ChatOpenAI } from "@langchain/openai";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class LlmFactory {
    constructor(private readonly config: ConfigService) { }

    // 🔥 THIS is the function you call
    getLLM(options: {
        model?: string;
        temperature?: number;
        maxTokens?: number;
    }) {
        return new ChatOpenAI({
            model: options.model ?? "nvidia/llama-3.1-nemotron-nano-8b-v1",
            temperature: options.temperature ?? 0.5,
            maxTokens: options.maxTokens ?? 4096,
            apiKey: this.config.get("NIM_API_KEY"),
            configuration: {
                baseURL: "https://integrate.api.nvidia.com/v1"
            }
        });
    }
}
