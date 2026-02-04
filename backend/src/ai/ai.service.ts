import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HrAiResultDto } from 'src/hr/hr.dto';
import { LlmFactory } from './llm.factory';
import { AiFeedback, CodingSubmission, SubmissionVerdict } from 'src/schema/coding-submission.schema';
import { CodingQuestion, Constraints, Example } from 'src/schema/coding-questions.schema';
import { HrAiEvaluation, HrQuestionResponse } from 'src/schema/hr-session.schema';

function isValidScore(value: any): value is number {
    return (
        typeof value === 'number' &&
        Number.isFinite(value) &&
        value >= 0 &&
        value <= 100
    );
}
// export enum SubmissionVerdict {
//     ACCEPTED = 'accepted',
//     REJECTED = 'rejected',
//     NEEDS_IMPROVEMENT = 'needs_improvement',
// }

// export interface AiFeedback {
//     clarityScore?: number;
//     correctnessScore?: number;
//     suggestions?: string;
// }

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
        durationSeconds
    }: {
        question: string;
        preferredAnswer: string;
        userAnswer: string;
        durationSeconds?: number;
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
        difficulty: string
    }): Promise<AiReviewResponse> {
        const llm = this.llmFactory.getLLM({
            model: "meta/llama-3.3-70b-instruct",
            temperature: 0.5,
        });
        const prompt = this.buildCodeReviewPrompt(data);
        const response = await llm.invoke(prompt);
        const preprocess = this.preprocess(response.content as string);

        return this.validateAiReviewShape(this.safeJsonParse(preprocess));

    }
    async hrFinalReport(data: HrQuestionResponse[]): Promise<HrAiEvaluation> {
        const llm = this.llmFactory.getLLM({
            temperature: 0.2,
        });
        const prompt = this.buildHrAiEvaluationPrompt(data);
        const response = await llm.invoke(prompt);
        const json = this.safeJsonParse(response.content as string);
        return this.validateHrAiEvaluationShape(json);
    }
    //TODO: WRITE THE PROMPT
    private buildHrAiEvaluationPrompt(data: HrQuestionResponse[]): string {
        return `
You are an interview evaluation engine.

TASK:
Analyze ALL provided interview answers and produce a FINAL aggregated evaluation.

STRICT RULES (MANDATORY):
- Output ONLY valid JSON
- NO markdown
- NO explanations
- NO extra fields
- Scores MUST be integers between 0 and 100
- improvementTips MUST contain 3 to 5 items
- generatedPreferredAnswer MUST be 4–6 concise sentences

JSON SCHEMA (EXACT):
{
  "clarity": number,
  "structure": number,
  "confidence": number,
  "improvementTips": string[],
  "generatedPreferredAnswer": string
}

EVALUATION GUIDELINES:
- clarity → communication, articulation, simplicity
- structure → logical flow, organization, completeness
- confidence → decisiveness, certainty, ownership

INTERVIEW DATA:
${JSON.stringify(data)}

IMPORTANT:
- Scores must represent OVERALL performance, not per-question averages
- improvementTips must be concrete and actionable
- generatedPreferredAnswer should be a strong model answer summary

Return ONLY the JSON.
`;
    }



    //FIXME:RE-WRITE THE PROMPTS
    private buildCodeReviewPrompt(data: {
        title: string;
        problem: string;
        constraints: Constraints;
        examples: Example[];
        topics: string[];
        solution: string;
        explanation?: string;
    }): string {
        return `
You are a deterministic code-review engine for a coding interview platform.

TASK:
Evaluate the candidate's solution strictly and objectively.

STRICT RULES (MANDATORY):
- Output ONLY valid JSON
- NO markdown
- NO comments
- NO extra keys
- NO trailing commas
- Scores MUST be integers between 0 and 100
- verdict MUST follow the verdict rules exactly

VERDICT RULES:
- "accepted" → correctnessScore >= 80 AND clarityScore >= 60
- "rejected" → correctnessScore < 40
- "needs_improvement" → all other cases

JSON SCHEMA (EXACT):
{
  "verdict": "accepted | rejected | needs_improvement",
  "aiFeedback": {
    "clarityScore": number,
    "correctnessScore": number,
    "suggestions": string
  }
}

PROBLEM:
${data.title}

${data.problem}

CONSTRAINTS:
${JSON.stringify(data.constraints)}

EXAMPLES:
${data.examples.map(e => `${e.input} -> ${e.output}`).join('\n')}

TOPICS:
${data.topics.join(', ')}

USER SOLUTION:
${data.solution}

EXPLANATION:
${data.explanation ?? 'N/A'}

IMPORTANT:
- suggestions MUST be concise, concrete, and actionable
- NO praise
- If rejected, explain exactly why
- If accepted, still provide one improvement suggestion

Return ONLY the JSON now.
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

    private validateAiReviewShape(raw: any): AiReviewResponse {
        if (!raw || typeof raw !== 'object') {
            throw new Error('AI review response is not an object');
        }

        const { verdict, aiFeedback } = raw;

        if (!Object.values(SubmissionVerdict).includes(verdict)) {
            throw new Error('Invalid verdict');
        }

        if (!aiFeedback || typeof aiFeedback !== 'object') {
            throw new Error('Missing aiFeedback');
        }

        const { clarityScore, correctnessScore, suggestions } = aiFeedback;

        if (!isValidScore(clarityScore)) {
            throw new Error('Invalid clarityScore');
        }

        if (!isValidScore(correctnessScore)) {
            throw new Error('Invalid correctnessScore');
        }

        if (typeof suggestions !== 'string' || !suggestions.trim()) {
            throw new Error('Invalid suggestions');
        }

        return {
            verdict,
            aiFeedback: {
                clarityScore,
                correctnessScore,
                suggestions: suggestions.trim(),
            },
        };
    }


    //FIXME
    private validateHrAiEvaluationShape(raw: any): HrAiEvaluation {
        if (!raw || typeof raw !== 'object') {
            throw new Error('AI HR response is not an object');
        }

        const {
            clarity,
            structure,
            confidence,
            improvementTips,
            generatedPreferredAnswer,
        } = raw;

        if (!isValidScore(clarity)) throw new Error('Invalid clarity');
        if (!isValidScore(structure)) throw new Error('Invalid structure');
        if (!isValidScore(confidence)) throw new Error('Invalid confidence');

        if (
            !Array.isArray(improvementTips) ||
            improvementTips.length < 3 ||
            improvementTips.length > 5
        ) {
            throw new Error('Invalid improvementTips');
        }

        if (
            typeof generatedPreferredAnswer !== 'string' ||
            !generatedPreferredAnswer.trim()
        ) {
            throw new Error('Invalid generatedPreferredAnswer');
        }

        return {
            avgClarity: clarity,
            avgStructure: structure,
            avgConfidence: confidence,
            overallFeedback: improvementTips.join(' | '),
            evaluationVersion: 'v1',
        };
    }

}

