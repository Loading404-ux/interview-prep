import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ActivityLog, ActivityLogType } from "src/schema/activity-log.schema";
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
  eventType: ActivityLogType;
  referenceId?: Types.ObjectId;
  metadata?: Record<string, any>;
}) {
  const date = new Date().toISOString().split('T')[0];

  const update: any = {};

  // 🔥 Contribution = ONLY accepted coding
  if (eventType === ActivityLogType.CODING_ACCEPTED) {
    update.$inc = { contributionCount: 1 };
  }

  // 🔥 Streak = ANY activity
  update.$set = {
    ...(eventType.startsWith('CODING') && { didCoding: true }),
    ...(eventType.startsWith('HR') && { didHr: true }),
    ...(eventType.startsWith('APTITUDE') && { didAptitude: true }),
  };

  await this.logModel.create({
    userId,
    clerkUserId,
    eventType,
    referenceId,
    metadata,
  });

  await this.dailyModel.updateOne(
    { clerkUserId, date },
    update,
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
