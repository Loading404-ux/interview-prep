import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HrAiEvaluation, HrSession } from '../schema/hr-session.schema';
import { HrQuestion } from '../schema/hr-questions.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HrSessionRepository {
  constructor(
    @InjectModel(HrSession.name)
    private readonly sessionModel: Model<HrSession>,
  ) { }

  createSession(data: Partial<HrSession>) {
    return this.sessionModel.create(data);
  }

  findById(sessionId: string) {
    return this.sessionModel.findById(sessionId);
  }

  async addQuestionResponse(
    sessionId: string,
    response: {
      questionId: string;
      transcript: string;
      durationSeconds?: number;
      aiResult: any;
    },
  ) {
    return this.sessionModel.updateOne(
      {
        _id: sessionId,
        'questions.questionId': { $ne: response.questionId },
      },
      {
        $push: {
          questions: {
            questionId: response.questionId,
            transcript: response.transcript,
            durationSeconds: response.durationSeconds,
            aiResult: response.aiResult,
          },
        },
      },
    );
  }

  updateStatus(sessionId: string, status: string) {
    return this.sessionModel.updateOne(
      { _id: sessionId },
      { status },
    );
  }
  markCompleted(sessionId: string, userId: string) {
    return this.sessionModel.findOneAndUpdate(
      {
        _id: sessionId,
        userId: new Types.ObjectId(userId),
        status: 'STARTED',
      },
      {
        $set: {
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      },
      { new: true },
    );
  }

  //TODO: Later on
  markAiPending(sessionId: string) {
    return this.sessionModel.updateOne(
      { _id: sessionId, status: 'COMPLETED' },
      { status: 'AI_PENDING' },
    );
  }

  markAiDone(sessionId: string, evaluation: HrAiEvaluation) {
    return this.sessionModel.updateOne(
      { _id: sessionId, status: 'AI_PENDING' },
      {
        status: 'AI_DONE',
        aiEvaluation: evaluation,
      },
    );
  }

  markAiFailed(sessionId: string) {
    return this.sessionModel.updateOne(
      { _id: sessionId, status: 'AI_PENDING' },
      { status: 'AI_FAILED' },
    );
  }

}

@Injectable()
export class HrQuestionRepository {
  constructor(
    @InjectModel(HrQuestion.name)
    private readonly model: Model<HrQuestion>,
  ) { }

  findRandom(limit = 3) {
    return this.model.aggregate([{ $sample: { size: limit } }]);
  }

  findById(id: string) {
    return this.model.findById(id);
  }
}
