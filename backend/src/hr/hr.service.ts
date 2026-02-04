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
import { ActivityLogType } from 'src/schema/activity-log.schema';
import { HrAiEvaluation, HrSessionStatus } from 'src/schema/hr-session.schema';

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
  async startSession(dto: StartHrSessionDto, numberOfQuestions = 3) {
    const questions = await this.questionRepo.findRandom(numberOfQuestions);

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
    audioFile: Express.Multer.File;
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
      console.log(input.audioFile)
      const result = await this.assemblyAiService.transcribe(
        input.audioFile.path,
      );
      console.log(result)
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
      durationSeconds,
    });

    await this.sessionRepo.addQuestionResponse(input.sessionId, {
      questionId: input.questionId,
      transcript,
      durationSeconds,
      aiResult,
    });

    return aiResult;
  }


  async completeSession(dto: CompleteSessionDto): Promise<HrAiEvaluation> {
    const session = await this.sessionRepo.findById(dto.sessionId)
    if (!session) {
      throw new BadRequestException('Session not found or already completed');
    }

    const finalReport = await this.aiService.hrFinalReport(session.questions);

    //TODO:RUN both THIS PARALLELY
    await this.sessionRepo.updateStatus(dto.sessionId, HrSessionStatus.COMPLETED);
    await this.sessionRepo.updateSession(dto.sessionId, { aiEvaluation: finalReport });

    // HrAiEvaluation
    // ✅ Activity

    //TODO:RUN both THIS PARALLELY
    await this.activityService.record({
      userId: session.userId,
      clerkUserId: session.clerkUserId,
      eventType: ActivityLogType.HR_SESSION_COMPLETE,
      referenceId: session._id,
    });
    await this.progressService.onHrSessionCompleted(session);

    return finalReport;
  }

}
