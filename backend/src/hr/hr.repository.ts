import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HrAiEvaluation, HrSession, HrSessionStatus } from '../schema/hr-session.schema';
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

  addQuestionResponse(
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

  updateSession(sessionId: string, data: Partial<HrSession>) {
    return this.sessionModel.updateOne({ _id: sessionId }, data);
  }

  updateStatus(sessionId: string, status: HrSessionStatus) {
    return this.sessionModel.updateOne(
      { _id: sessionId },
      { status },
      {}
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
