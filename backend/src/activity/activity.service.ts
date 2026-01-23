import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { ActivityLog } from 'src/schema/activity-log.schema';
import { ActivityRepository } from './activity.repository';
import { InjectModel } from '@nestjs/mongoose';
import { UserMetrics } from 'src/schema/user_metrics.schema';
import { ActivityHistoryDto, ContributionDayDto } from './activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    private readonly repo: ActivityRepository,
    @InjectModel(UserMetrics.name)
    private readonly metricsModel: Model<UserMetrics>,
  ) {}

  /* ---------- WRITE ---------- */

  async record(event: {
    userId: Types.ObjectId;
    clerkUserId: string;
    eventType: 'CODING_SUBMIT' | 'CODING_APPROVED' | 'HR_SESSION_COMPLETE' | 'APTITUDE_ATTEMPT';
    referenceId?: Types.ObjectId;
    metadata?: Record<string, any>;
  }) {
    return this.repo.logAndAggregate(event);
  }

  /* ---------- READ: HISTORY ---------- */

  async getHistory(clerkUserId: string): Promise<ActivityHistoryDto[]> {
    const logs = await this.repo.getRecentActivities(clerkUserId);

    return logs.map(log => ({
      id: log._id.toString(),
      type: this.mapType(log.eventType),
      title: this.buildTitle(log),
      description: log.description ?? '',
      date: log.createdAt,
      result: this.buildResult(log),
    }));
  }

  /* ---------- READ: CONTRIBUTIONS ---------- */

  async getContributionCalendar(
    clerkUserId: string,
    days = 90,
  ): Promise<ContributionDayDto[]> {
    const from = new Date();
    from.setDate(from.getDate() - days);

    const daily = await this.repo.getDailyActivities(
      clerkUserId,
      from.toISOString().split('T')[0],
    );

    return daily.map(d => ({
      date: d.date,
      verified: d.contributionCount > 0,
    }));
  }

  /* ---------- READ: STREAK ---------- */

  async getStreak(clerkUserId: string) {
    const metrics = await this.metricsModel.findOne({ clerkUserId });
    return metrics?.streak ?? { current: 0, longest: 0 };
  }

  /* ---------- HELPERS ---------- */

  private mapType(eventType: string): 'coding' | 'hr' | 'aptitude' {
    if (eventType.startsWith('CODING')) return 'coding';
    if (eventType.startsWith('HR')) return 'hr';
    return 'aptitude';
  }

  private buildTitle(log: ActivityLog): string {
    switch (log.eventType) {
      case 'CODING_SUBMIT':
      case 'CODING_APPROVED':
        return log.metadata?.title ?? 'Coding Problem';
      case 'HR_SESSION_COMPLETE':
        return 'HR Mock Interview';
      case 'APTITUDE_ATTEMPT':
        return log.metadata?.title ?? 'Aptitude Quiz';
      default:
        return 'Activity';
    }
  }

  private buildResult(log: ActivityLog): string | undefined {
    if (log.eventType === 'CODING_APPROVED') {
      return 'Accepted';
    }
    if (log.eventType === 'HR_SESSION_COMPLETE') {
      return log.metadata?.confidence
        ? `${log.metadata.confidence}% confidence`
        : undefined;
    }
    if (log.eventType === 'APTITUDE_ATTEMPT') {
      return log.metadata?.score != null
        ? `${log.metadata.score} correct`
        : undefined;
    }
    return undefined;
  }
}

