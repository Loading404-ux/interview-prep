import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HrAiResultDto } from 'src/hr/hr.dto';
import { LlmFactory } from './llm.factory';

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
}
