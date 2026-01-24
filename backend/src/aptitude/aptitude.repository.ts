import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AptitudeQuestion } from "src/schema/aptitude-question.schema";
import { AptitudeSession } from "src/schema/aptitude-session.schema";

@Injectable()
export class AptitudeRepository {
  constructor(
    @InjectModel(AptitudeQuestion.name)
    private readonly questionModel: Model<AptitudeQuestion>,
    @InjectModel(AptitudeSession.name)
    private readonly sessionModel: Model<AptitudeSession>,
  ) { }

  getRandomQuestions(limit: number) {
    return this.questionModel.aggregate([{ $sample: { size: limit } }]);
  }

  findQuestionById(id: string) {
    return this.questionModel.findById(id);
  }

  createSession(data: Partial<AptitudeSession>) {
    return this.sessionModel.create(data);
  }

  updateStats(sessionId: string, isCorrect: boolean) {
    return this.sessionModel.updateOne(
      { _id: sessionId },
      {
        $inc: isCorrect
          ? { correctCount: 1 }
          : { wrongCount: 1 },
      },
    );
  }

  markCompleted(sessionId: string) {
    return this.sessionModel.findOneAndUpdate(
      {
        _id: sessionId,
        status: 'STARTED',
      },
      {
        $set: { status: 'COMPLETED' },
      },
      { new: true },
    );
  }
  // async findActiveSession(sessionId: string) {
  //   return this.sessionModel.findOne({
  //     _id: sessionId,
  //     status: "STARTED",
  //   });
  // }
  // async findAnswer(sessionId: string, questionId: string) {
  //   return this.answerModel.findOne({
  //     sessionId,
  //     questionId,
  //   });
  // }

}
