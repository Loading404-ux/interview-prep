import { Injectable, BadRequestException } from '@nestjs/common';
import {
  CompleteSessionDto,
  StartHrSessionDto,
  SubmitHrAnswerDto,
} from './hr.dto';
import {
  HrSessionRepository,
  HrQuestionRepository,
} from './hr.repository';
import { HrMapper } from './hr.mapper';
import { AiService } from 'src/ai/ai.service';
import { Types } from 'mongoose';

@Injectable()
export class HrService {
  constructor(
    private readonly sessionRepo: HrSessionRepository,
    private readonly questionRepo: HrQuestionRepository,
    private readonly aiService: AiService,
  ) { }

  /* ---------- START SESSION ---------- */
  async startSession(dto: StartHrSessionDto) {
    const questions = await this.questionRepo.findRandom(3);

    const session = await this.sessionRepo.createSession({
      userId: new Types.ObjectId(dto.userId),
      clerkUserId: dto.clerkUserId,
      status: 'STARTED',
      questions: [],
    });

    return {
      sessionId: session._id.toString(),
      questions: questions.map(HrMapper.toQuestionView),
    };
  }

  /* ---------- SUBMIT ANSWER ---------- */
  async submitAnswer(dto: SubmitHrAnswerDto) {
    const session = await this.sessionRepo.findById(dto.sessionId);
    if (!session) throw new BadRequestException('Session not found');

    if (session.status !== 'STARTED')
      throw new BadRequestException('Session not active');

    const question = await this.questionRepo.findById(dto.questionId);
    if (!question) throw new BadRequestException('Question not found');

    // 🔥 LLM evaluation
    const aiResult = await this.aiService.hrAIEvaluate({
      question: question.question,
      preferredAnswer: question.preferred_answer,
      userAnswer: dto.transcript,
    });

    await this.sessionRepo.addQuestionResponse(dto.sessionId, {
      questionId: dto.questionId,
      transcript: dto.transcript,
      durationSeconds: dto.durationSeconds,
      aiResult,
    });

    return aiResult;
  }

  async completeSession(dto: CompleteSessionDto) {
    const session = await this.sessionRepo.markCompleted(
      dto.sessionId,
      dto.userId,
    );

    if (!session) {
      throw new BadRequestException(
        'Session not found or already completed',
      );
    }

    /**
     * 🚫 DO NOT DO THESE YET:
     * - AI evaluation
     * - streak updates
     * - achievements
     * - activity logs
     *
     * These will be added AFTER:
     * HR module ✅
     * Aptitude module ✅
     */

    return {
      sessionId: session._id,
      status: session.status,
      completedAt: session.completedAt,
    };
  }
}
