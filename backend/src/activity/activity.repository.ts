import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { ActivityLog } from "src/schema/activity-log.schema";
import { DailyActivity } from "src/schema/daily-activity.schema";

@Injectable()
export class ActivityRepository {
    constructor(
        private readonly activityLogModel: Model<ActivityLog>,
        private readonly dailyActivityModel: Model<DailyActivity>,
    ) { }

    // 1. Audit
    async newActivityLog(userId: string, submissionId: string, date: Date) {
        await this.activityLogModel.create({
            userId,
            eventType: "CODING_SUBMIT",
            referenceId: submissionId,
            description: 'Submitted coding solution'
        });
    }


    // 2. Daily aggregation
    async updateDailyActivity(userId: string, date: Date) {
        await this.dailyActivityModel.updateOne(
            { userId, date },
            {
                $set: { didCoding: true },
                $inc: { contributionCount: 1 }
            },
            { upsert: true }
        );
    }


}