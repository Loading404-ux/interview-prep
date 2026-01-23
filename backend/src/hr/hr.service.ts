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
import { ActivityService } from 'src/activity/activity.service';
import { UserProgressService } from 'src/user/user-progress.service';
import { AssemblyAiService } from 'src/ai/assemblyai.service';

@Injectable()
export class HrService {
  constructor(
    private readonly sessionRepo: HrSessionRepository,
    private readonly questionRepo: HrQuestionRepository,
    private readonly aiService: AiService,
    private readonly activityService: ActivityService,
    private readonly progressService: UserProgressService,
    private readonly assemblyAiService: AssemblyAiService,
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
  async submitAnswer(input: {
    sessionId: string;
    questionId: string;
    audioFile?: Express.Multer.File;
    transcript?: string;
  }) {
    const session = await this.sessionRepo.findById(input.sessionId);
    if (!session) throw new BadRequestException('Session not found');
    if (session.status !== 'STARTED')
      throw new BadRequestException('Session not active');

    const question = await this.questionRepo.findById(input.questionId);
    if (!question) throw new BadRequestException('Question not found');

    let transcript = input.transcript;
    let durationSeconds: number | undefined;

    // 🎙️ AUDIO PATH (PRIMARY)
    if (!transcript) {
      if (!input.audioFile) {
        throw new BadRequestException(
          'Either audio file or transcript must be provided',
        );
      }

      const result = await this.assemblyAiService.transcribe(
        input.audioFile.path,
      );

      transcript = result.text;
      durationSeconds = result.durationSeconds;

      if (!transcript || transcript.length < 5) {
        throw new BadRequestException('Audio transcription failed');
      }
    }

    // 🤖 AI evaluation
    const aiResult = await this.aiService.hrAIEvaluate({
      question: question.question,
      preferredAnswer: question.preferred_answer,
      userAnswer: transcript,
    });

    await this.sessionRepo.addQuestionResponse(input.sessionId, {
      questionId: input.questionId,
      transcript,
      durationSeconds,
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
      throw new BadRequestException('Session not found or already completed');
    }

    // ✅ Activity
    await this.activityService.record({
      userId: session.userId,
      clerkUserId: session.clerkUserId,
      eventType: 'HR_SESSION_COMPLETE',
      referenceId: session._id,
    });

    // ✅ Metrics + achievements
    await this.progressService.onHrSessionCompleted(session);

    return {
      sessionId: session._id,
      status: session.status,
      completedAt: session.completedAt,
    };
  }

}
