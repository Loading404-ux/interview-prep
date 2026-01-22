import { Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { ActivityLog } from "src/schema/activity-log.schema";
import { DailyActivity } from "src/schema/daily-activity.schema";

@Injectable()
export class ActivityRepository {
    constructor(
        private readonly activityModel: Model<ActivityLog>,
        private readonly dailyModel: Model<DailyActivity>,
    ) { }

    // 1. Audit
    async newActivityLog(userId: string, submissionId: string, date: Date) {
        await this.activityModel.create({
            userId,
            eventType: "CODING_SUBMIT",
            referenceId: submissionId,
            description: 'Submitted coding solution'
        });
    }


    // 2. Daily aggregation
    async updateDailyActivity(userId: string, date: Date) {
        await this.dailyModel.updateOne(
            { userId, date },
            {
                $set: { didCoding: true },
                $inc: { contributionCount: 1 }
            },
            { upsert: true }
        );
    }
  async logEvent(data: Partial<ActivityLog>) {
    return this.activityModel.create(data);
  }

  async upsertDailyActivity({
    userId,
    clerkUserId,
    date,
    type,
  }: {
    userId: Types.ObjectId;
    clerkUserId: string;
    date: string;
    type: 'coding' | 'hr' | 'aptitude';
  }) {
    const update: any = {
      $inc: { contributionCount: 1 },
    };

    if (type === 'coding') update.$set = { didCoding: true };
    if (type === 'hr') update.$set = { didHr: true };
    if (type === 'aptitude') update.$set = { didAptitude: true };

    return this.dailyModel.updateOne(
      { userId, date },
      {
        $setOnInsert: { clerkUserId, date },
        ...update,
      },
      { upsert: true },
    );
  }

  /* ---------- READ ---------- */

  getRecentActivities(userId: Types.ObjectId, limit = 20) {
    return this.activityModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  getDailyActivities(userId: Types.ObjectId, from: string) {
    return this.dailyModel.find({
      userId,
      date: { $gte: from },
    });
  }

}