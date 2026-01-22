import { Injectable } from "@nestjs/common";
import { AptitudeRepository } from "./aptitude.repository";
import { StartAptitudeSessionDto, SubmitAptitudeAnswerDto } from "./aptitude.dto";
import { Types } from "mongoose";

@Injectable()
export class AptitudeService {
  constructor(private readonly repo: AptitudeRepository) {}

  async startSession(input: {
    userId: string;
    clerkUserId: string;
    mode: 'RAPID' | 'STANDARD';
  }) {
    const count = input.mode === 'RAPID' ? 5 : 10;

    const questions = await this.repo.getRandomQuestions(count);

    const session = await this.repo.createSession({
      userId: new Types.ObjectId(input.userId),
      clerkUserId: input.clerkUserId,
      mode: input.mode,
      totalQuestions: count,
    });

    return {
      sessionId: session.id,
      questions: questions.map(q => ({
        id: q.id,
        text: q.text,
        options: q.options,
      })),
    };
  }

  async submitAnswer(input: {
    userId: string;
    clerkUserId: string;
    sessionId: string;
    questionId: string;
    selectedOption: number;
  }) {
    const question = await this.repo.findQuestionById(input.questionId);
    if (!question) throw new Error('Question not found');

    const isCorrect = question.correctAnswerIndex === input.selectedOption;

    await this.repo.updateStats(input.sessionId, isCorrect);

    return {
      correct: isCorrect,
      correctAnswer: question.correctAnswerIndex,
      explanation: question.explanation,
    };
  }
}
