import { Injectable } from "@nestjs/common";
import { AptitudeRepository } from "./aptitude.repository";
import { StartAptitudeSessionDto, SubmitAptitudeAnswerDto } from "./aptitude.dto";
import { Types } from "mongoose";
import { ActivityService } from "src/activity/activity.service";
import { UserProgressService } from "src/user/user-progress.service";

@Injectable()
export class AptitudeService {
  constructor(private readonly repo: AptitudeRepository, private readonly activityService: ActivityService, private readonly progressService: UserProgressService) { }

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
    console.log({
      sessionId: session.id,
      questions: questions.map(q => ({
        id: q._id,
        text: q.text,
        options: q.options,
      })),
    })
    return {
      sessionId: session.id,
      questions: questions.map(q => ({
        id: q._id,
        text: q.text,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex,
        explanation: q.explanation,
      }))
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
    console.log(question.correctAnswerIndex, input.selectedOption)
    const isCorrect = question.correctAnswerIndex === input.selectedOption;

    await this.repo.updateStats(input.sessionId, isCorrect);

    return {
      correct: isCorrect,
      correctAnswer: question.correctAnswerIndex,
      explanation: question.explanation,
    };
  }

  async completeSession(input: {
    userId: string;
    clerkUserId: string;
    sessionId: string;
  }) {
    const session = await this.repo.markCompleted(input.sessionId);
    if (!session) throw new Error('Session not found or already completed');

    await this.activityService.record({
      userId: session.userId,
      clerkUserId: session.clerkUserId,
      eventType: 'APTITUDE_ATTEMPT',
      referenceId: session._id,
    });

    await this.progressService.onAptitudeCompleted(session);

    return {
      sessionId: session._id,
      status: session.status,
      accuracy:
        session.totalQuestions > 0
          ? Math.round(
            (session.correctCount / session.totalQuestions) * 100,
          )
          : 0,
    };
  }

}
