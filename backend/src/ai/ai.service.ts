import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HrAiResultDto } from 'src/hr/hr.dto';
import { LlmFactory } from './llm.factory';
import { CodingSubmission } from 'src/schema/coding-submission.schema';
import { CodingQuestion, Constraints, Example } from 'src/schema/coding-questions.schema';

function isValidScore(value: any): value is number {
    return (
        typeof value === 'number' &&
        Number.isFinite(value) &&
        value >= 0 &&
        value <= 100
    );
}
export enum SubmissionVerdict {
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
    NEEDS_IMPROVEMENT = 'needs_improvement',
}

export interface AiFeedback {
    clarityScore?: number;
    correctnessScore?: number;
    suggestions?: string;
}

export interface AiReviewResponse {
    verdict: SubmissionVerdict;
    aiFeedback: AiFeedback;
}
@Injectable()
export class AiService {
    constructor(private readonly llmFactory: LlmFactory) { }

    async hrAIEvaluate({
        question,
        preferredAnswer,
        userAnswer,
    }: {
        question: string;
        preferredAnswer: string;
        userAnswer: string;
    }): Promise<HrAiResultDto> {
        const llm = this.llmFactory.getLLM({
            temperature: 0.2,
        });

        const prompt = this.buildStrictPrompt({
            question,
            preferredAnswer,
            userAnswer,
        });

        const response = await llm.invoke(prompt);

        return this.safeJsonParse(response.content as string);
    }
    async aiCodeReview(data: {
        title: string;
        problem: string;
        constraints: Constraints;
        examples: Example[];
        topics: string[];
        solution: string;
        explanation?: string;
    }): Promise<AiReviewResponse> {
        const llm = this.llmFactory.getLLM({
            model: "meta/llama-3.3-70b-instruct",
            temperature: 0.5,
        });
        const prompt = this.bbuildCodeReviewPrompt(data);
        const response = await llm.invoke(prompt);
       const preprocess=this.preprocess(response.content as string);

        return this.validateAiReviewShape(this.safeJsonParse(preprocess));

    }


    private bbuildCodeReviewPrompt(data: {
        title: string;
        problem: string;
        constraints: Constraints;
        examples: Example[];
        topics: string[];
        solution: string;
        explanation?: string;
    }) {
        return `
You are a strict senior software engineer reviewing a coding interview solution.
Your task is to evaluate the submission objectively and return a structured JSON response.

--------------------
PROBLEM STATEMENT:
${data.title}

${data.problem}

--------------------
CONSTRAINTS:
${data.constraints}

--------------------
TEST_CASES:
${data.examples.map((example) => `- ${example.input} -> ${example.output}`).join('\n')}

--------------------
TOPICS_USED:
${data.constraints}

--------------------
USER SOLUTION:
${data.solution ?? 'N/A'}

--------------------
EXPLANATION (if any):
${data.explanation ?? 'N/A'}

--------------------
EVALUATION CRITERIA:

1. Correctness (0–100)
- Does the solution fully solve the problem?
- Handles edge cases?
- Produces correct output for all valid inputs?

2. Clarity (0–100)
- Readability of code
- Naming, structure, comments
- Logical flow

--------------------
VERDICT RULES (MANDATORY):

- ACCEPTED:
  correctnessScore >= 80 AND clarityScore >= 60

- REJECTED:
  correctnessScore < 40

- NEEDS_IMPROVEMENT:
  All other cases

--------------------
OUTPUT FORMAT (STRICT):

Strictly Return ONLY valid JSON.
DO NOT include explanations outside JSON.
DO NOT include markdown.
DO NOT include trailing commas.

The JSON schema MUST be:

{
  "verdict": "accepted | rejected | needs_improvement",
  "aiFeedback": {
    "clarityScore": number (0-100),
    "correctnessScore": number (0-100),
    "suggestions": string
  }
}

--------------------
IMPORTANT:
- suggestions must be concise, concrete, and actionable
- do NOT praise the user
- do NOT mention that you are an AI
- if the solution is rejected, clearly explain why in suggestions
- if accepted, still give at least one improvement suggestion

Return the JSON now.
`;
    }

    private buildStrictPrompt({
        question,
        preferredAnswer,
        userAnswer,
    }: {
        question: string;
        preferredAnswer: string;
        userAnswer: string;
    }): string {
        return `
                You are an interview evaluation engine.

                TASK:
                Evaluate the candidate answer strictly, according to the question, prefered answer and candidate answer.

                STRICT RULES (MANDATORY):
                    - Respond ONLY with valid JSON
                    - NO markdown
                    - NO explanation
                    - NO extra text
                    - JSON MUST match schema exactly
                    - Scores must be integers between 0 and 100
                    - improvementTips must contain 3 to 5 items
                    - generatedPreferredAnswer must be sort but acceptable and easy to remember, 5-6 sentence max.

                SCHEMA:
                {
                    "clarity": number,
                    "structure": number,
                    "confidence": number,
                    "improvementTips": string[],
                    "generatedPreferredAnswer": string
                }

                QUESTION:
                ${question}

                PREFERRED ANSWER GUIDANCE:
                ${preferredAnswer}

                CANDIDATE ANSWER:
                ${userAnswer}

                OUTPUT:
                Return ONLY the JSON object.
`;
    }

    private safeJsonParse(raw: string): HrAiResultDto {
        try {
            const cleaned = this.preprocess(raw);
            const parsed = JSON.parse(cleaned);
            this.validateShape(parsed);
            return parsed;
        } catch (err) {
            throw new InternalServerErrorException(
                'AI response is not valid structured JSON',
            );
        }
    }

    private preprocess(raw: string): string {
        let text = raw.trim();

        // 1️⃣ Remove ```json ``` or ``` ```
        text = text.replace(/```(?:json)?/gi, '').replace(/```/g, '');

        // 2️⃣ Extract first JSON object (most important)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No JSON object found in AI response');
        }

        text = jsonMatch[0];

        // 3️⃣ Remove JS-style comments
        text = text
            .replace(/\/\/.*$/gm, '')          // line comments
            .replace(/\/\*[\s\S]*?\*\//g, ''); // block comments

        // 4️⃣ Remove trailing commas (common LLM mistake)
        text = text.replace(/,\s*([}\]])/g, '$1');

        return text;
    }

    private validateShape(obj: any) {
        const isValid =
            typeof obj === 'object' &&
            typeof obj.clarity === 'number' &&
            typeof obj.structure === 'number' &&
            typeof obj.confidence === 'number' &&
            Array.isArray(obj.improvementTips) &&
            typeof obj.generatedPreferredAnswer === 'string';

        if (!isValid) {
            throw new Error('Invalid AI response shape');
        }
    }

    private validateAiReviewShape(
        raw: any,
    ): AiReviewResponse {
        if (!raw || typeof raw !== 'object') {
            throw new Error('AI response is not an object');
        }

        // -------- verdict --------
        if (
            !raw.verdict ||
            !Object.values(SubmissionVerdict).includes(raw.verdict)
        ) {
            throw new Error('Invalid or missing verdict');
        }

        // -------- aiFeedback --------
        if (!raw.aiFeedback || typeof raw.aiFeedback !== 'object') {
            throw new Error('Missing aiFeedback object');
        }

        const { clarityScore, correctnessScore, suggestions } = raw.aiFeedback;

        if (!isValidScore(clarityScore)) {
            throw new Error('Invalid clarityScore');
        }

        if (!isValidScore(correctnessScore)) {
            throw new Error('Invalid correctnessScore');
        }

        if (
            typeof suggestions !== 'string' ||
            suggestions.trim().length === 0
        ) {
            throw new Error('Invalid suggestions');
        }

        return {
            verdict: raw.verdict,
            aiFeedback: {
                clarityScore,
                correctnessScore,
                suggestions: suggestions.trim(),
            },
        };
    }

}
