import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { HrSession } from "src/schema/hr-session.schema";

@Injectable()
export class HrRepository {
  constructor(
    @InjectModel(HrSession.name)
    private readonly sessionModel: Model<HrSession>,
  ) {}

  createSession(data: Partial<HrSession>) {
    return this.sessionModel.create(data);
  }

  findById(sessionId: Types.ObjectId) {
    return this.sessionModel.findById(sessionId);
  }

  updateSession(sessionId: Types.ObjectId, update: any) {
    return this.sessionModel.findByIdAndUpdate(
      sessionId,
      update,
      { new: true }
    );
  }
}
