import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { AptitudeSession } from "src/schema/aptitude-session.schema";
import { HrSession } from "src/schema/hr-session.schema";
import { UserAchievement } from "src/schema/user_achievements.schema";
import { UserMetrics } from "src/schema/user_metrics.schema";

@Injectable()
export class UserProgressService {
    constructor(
        @InjectModel(UserMetrics.name)
        private readonly metricsModel: Model<UserMetrics>,

        @InjectModel(UserAchievement.name)
        private readonly achievementModel: Model<UserAchievement>,
    ) { }

    //FIXME WRITE A FUNCTION FOR UPDATE USER METRIX VALUE NOT on___Accepted()
    /* =====================================================
       CODING — called when AI verdict = ACCEPTED
       ===================================================== */
    async onCodingAccepted(userId: Types.ObjectId, accuracy) {
        const metrics = await this.metricsModel.findOneAndUpdate(
            { userId },
            { $inc: { 'coding.acceptedSubmissions': 1 } },
            { new: true },
        );
        if (!metrics) {
            throw new Error('Metrics not found');
        }
        //    (aiFeedback.clarityScore ?? 0) + (aiFeedback.correctnessScore ?? 0) / 2
        const newAccuracy =
            (metrics.coding.accuracy + accuracy) / 2

        await this.metricsModel.updateOne(
            { userId },
            { 'coding.accuracy': newAccuracy },
        );
    }

    async onCodingSubmitted(userId: Types.ObjectId) {
        await this.metricsModel.updateOne(
            { userId },
            { $inc: { 'coding.totalSubmissions': 1 } },
            { upsert: true },
        );
    }

    /* =====================================================
       HR — called when session COMPLETED
       ===================================================== */
    async onHrSessionCompleted(session: HrSession) {
        const avgConfidence =
            session.aiEvaluation?.avgConfidence ?? 0;

        const metrics = await this.metricsModel.findOneAndUpdate(
            { userId: session.userId },
            {
                $inc: { 'hr.totalSessions': 1 },
            },
            { new: true, upsert: true },
        );
        const newAvgConfidence = session.aiEvaluation?.avgConfidence || 0
        // running average
        const prevTotal = (newAvgConfidence + metrics.hr.avgConfidence) / 2


        await this.metricsModel.updateOne(
            { userId: session.userId },
            { 'hr.avgConfidence': prevTotal, 'hr.totalSessions': metrics.hr.totalSessions + 1 },
        );

        // achievements
        await this.unlock(
            { userId: session.userId, clerkUserId: session.clerkUserId },
            'HR_MASTER',
            metrics.hr.totalSessions >= 10,
        );
    }

    /* =====================================================
       APTITUDE — called when session COMPLETED
       ===================================================== */
    async onAptitudeCompleted(session: AptitudeSession) {
        const accuracy =
            session.totalQuestions > 0
                ? Math.round(
                    (session.correctCount / session.totalQuestions) * 100,
                )
                : 0;

        const metrics = await this.metricsModel.findOneAndUpdate(
            { userId: session.userId },
            {
                $inc: { 'aptitude.totalAttempts': 1 },
            },
            { new: true, upsert: true },
        );

        // running average accuracy
        const prevTotal = metrics.aptitude.totalAttempts - 1;
        const newAvg =
            prevTotal === 0
                ? accuracy
                : Math.round(
                    (metrics.aptitude.accuracy * prevTotal + accuracy) /
                    metrics.aptitude.totalAttempts,
                );

        await this.metricsModel.updateOne(
            { userId: session.userId },
            { 'aptitude.accuracy': newAvg },
        );

        // achievements
        await this.unlock(
            { userId: session.userId, clerkUserId: session.clerkUserId },
            'QUANT_PRO',
            metrics.aptitude.totalAttempts >= 25,
        );
    }

    /* =====================================================
       STREAK — called AFTER activity record
       ===================================================== */
    async onStreakUpdate(input: {
        userId: Types.ObjectId;
        clerkUserId: string;
        currentStreak: number;
    }) {
        await this.unlock(input, 'STREAK_7', input.currentStreak >= 7);
    }

    /* ---------- READ: STREAK ---------- */

    async getStreak(clerkUserId: string) {
        const metrics = await this.metricsModel.findOne({ clerkUserId });
        return metrics?.streak ?? { current: 0, longest: 0 };
    }

    /* =====================================================
       ACHIEVEMENT UNLOCK (IDEMPOTENT)
       ===================================================== */
    private async unlock(
        input: { userId: Types.ObjectId; clerkUserId: string },
        key: string,
        condition: boolean,
    ) {
        if (!condition) return;

        await this.achievementModel.updateOne(
            { userId: input.userId, achievementKey: key },
            {
                $setOnInsert: {
                    clerkUserId: input.clerkUserId,
                    unlockedAt: new Date(),
                },
            },
            { upsert: true },
        );
    }

    async getProgressOverview(userId: Types.ObjectId) {
        const metrics = await this.metricsModel.findOne({ userId });

        if (!metrics) {
            return {
                coding: { totalSubmissions: 0, acceptedSubmissions: 0, accuracy: 0 },
                hr: { totalSessions: 0, avgConfidence: 0 },
                aptitude: { totalAttempts: 0, accuracy: 0 },
                //streak: { current: 0, longest: 0 },
            };
        }

        return {
            coding: metrics.coding,
            hr: metrics.hr,
            aptitude: metrics.aptitude,
            //streak: metrics.streak,
        };
    }

    async updateStreak(userId: Types.ObjectId, clerkUserId: string) {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000)
            .toISOString()
            .split('T')[0];

        const metrics =
            (await this.metricsModel.findOne({ userId })) ??
            (await this.metricsModel.create({ userId }));

        const last =
            metrics.streak.lastActiveDate
                ? metrics.streak.lastActiveDate.toISOString().split('T')[0]
                : null;

        if (last === today) return;

        const newCurrent = last === yesterday ? metrics.streak.current + 1 : 1;

        await this.metricsModel.updateOne(
            { userId },
            {
                $set: {
                    'streak.current': newCurrent,
                    'streak.longest': Math.max(metrics.streak.longest, newCurrent),
                    'streak.lastActiveDate': new Date(),
                },
            },
        );
    }


}
