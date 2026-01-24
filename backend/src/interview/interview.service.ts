import { Injectable } from "@nestjs/common";
import {  GeminiService } from "./gemini.util";
import {
  createSession,
  getSession,
  updateSession,
  deleteSession,
} from "./interview.store";

@Injectable()
export class InterviewService {
 constructor(private readonly gemini: GeminiService) {}
  /* STEP 1 — Resume → Context + First Question */
  async processResume(resumeText: string, role: string) {
    const prompt = `
You are a technical recruiter.

Extract resume insights.

Rules:
- Output ONLY JSON
- No markdown
- No explanation

Schema:
{
  "skills": string[],
  "seniority": "junior|mid|senior",
  "strengths": string[],
  "weakAreas": string[],
  "suggestedFocus": string[]
}

Resume:
${resumeText}
    `;

    const resumeContext = await this.gemini.json(prompt);

    const firstQuestion = await this.gemini.text(`
You are an HR interviewer.

Candidate context:
${JSON.stringify(resumeContext)}

Ask ONE opening interview question suitable for a ${role}.
`);

    const sessionId = createSession(resumeContext, firstQuestion);

    return {
      sessionId,
      initialQuestion: firstQuestion,
    };
  }

  /* STEP 2 — Answer → Evaluation + Next Question */
  async submitAnswer(sessionId: string, transcript: string) {
    const session = getSession(sessionId);
    if (!session) throw new Error("Session not found");

    session.answers.push(transcript);

    const evalPrompt = `
You are an interview evaluator.

Question:
${session.questions.at(-1)}

Answer:
${transcript}

Return JSON ONLY.

Schema:
{
  "clarity": number,
  "confidence": number,
  "depth": number,
  "redFlags": string[]
}
`;

    const signals = await this.gemini.json(evalPrompt);
    session.signals.push(signals);

    const nextQuestion = await this.gemini.text(`
You are an adaptive interviewer.

Resume context:
${JSON.stringify(session.resumeContext)}

Previous signals:
${JSON.stringify(session.signals)}

Ask ONE follow-up interview question.
`);

    session.questions.push(nextQuestion);

    updateSession(sessionId, session);

    return { nextQuestion };
  }

  /* STEP 3 — Final Report */
  async completeSession(sessionId: string) {
    const session = getSession(sessionId);
    if (!session) throw new Error("Session not found");

    const prompt = `
You are a hiring panel.

Resume context:
${JSON.stringify(session.resumeContext)}

Answers:
${JSON.stringify(session.answers)}

Signals:
${JSON.stringify(session.signals)}

Return JSON ONLY.

Schema:
{
  "finalVerdict": "Hire|Borderline|No-Hire",
  "confidenceScore": number,
  "strengths": string[],
  "concerns": string[]
}
`;

    const report = await this.gemini.json(prompt);

    deleteSession(sessionId);
    return report;
  }
}