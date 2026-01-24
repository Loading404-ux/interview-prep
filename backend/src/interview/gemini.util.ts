import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

@Injectable()
export class GeminiService {
  private model;
  private lastCall = 0;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>("GEMINI_API_KEY");

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    this.model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });
  }

  /** ⏱ Free-tier rate limit (≈5 RPM) */
  private async rateLimit() {
    const now = Date.now();
    const diff = now - this.lastCall;

    if (diff < 12_000) {
      await new Promise((r) => setTimeout(r, 12_000 - diff));
    }

    this.lastCall = Date.now();
  }

  /** 🔤 Plain text response */
  async text(prompt: string): Promise<string> {
    await this.rateLimit();

    const res = await this.model.generateContent(prompt);
    return res.response.text().trim();
  }

  /** 🧠 Structured JSON response (prompt-forced) */
  async json<T = any>(prompt: string): Promise<T> {
    await this.rateLimit();

    const res = await this.model.generateContent(prompt);
    const text = res.response.text();

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("Invalid Gemini JSON output");
    }

    return JSON.parse(text.slice(start, end + 1));
  }
}
