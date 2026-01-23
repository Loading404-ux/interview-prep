import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ActivityLog } from "src/schema/activity-log.schema";
import { DailyActivity } from "src/schema/daily-activity.schema";

@Injectable()
export class ActivityRepository {
  constructor(
    @InjectModel(ActivityLog.name)
    private readonly logModel: Model<ActivityLog>,
    @InjectModel(DailyActivity.name)
    private readonly dailyModel: Model<DailyActivity>,
  ) { }

  async logAndAggregate({
    clerkUserId,
    userId,
    eventType,
    referenceId,
    metadata,
  }: {
    clerkUserId: string;
    userId: Types.ObjectId;
    eventType: string;
    referenceId?: Types.ObjectId;
    metadata?: Record<string, any>;
  }) {
    const date = new Date().toISOString().split('T')[0];

    const typeMap = {
      CODING_SUBMIT: 'didCoding',
      HR_SESSION_COMPLETE: 'didHr',
      CODING_APPROVED: 'didCoding',
      APTITUDE_ATTEMPT: 'didAptitude',
    } as const;

    const flag = typeMap[eventType];

    await this.logModel.create({
      userId,
      clerkUserId,
      eventType,
      referenceId,
      metadata,
    });

    await this.dailyModel.updateOne(
      { clerkUserId, date },
      {
        $inc: { contributionCount: 1 },
        $set: { [flag]: true },
      },
      { upsert: true },
    );
  }

  getRecentActivities(clerkUserId: string, limit = 20) {
    return this.logModel
      .find({ clerkUserId })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  getDailyActivities(clerkUserId: string, from: string) {
    return this.dailyModel.find({
      clerkUserId,
      date: { $gte: from },
    });
  }
}
