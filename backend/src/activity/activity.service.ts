import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ActivityLog, ActivityLogType } from 'src/schema/activity-log.schema';
import { ActivityRepository } from './activity.repository';
import { ActivityHistoryDto, ContributionDayDto } from './activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    private readonly repo: ActivityRepository,
  ) { }

  /* ---------- WRITE ---------- */

  async record(event: {
    userId: Types.ObjectId;
    clerkUserId: string;
    eventType: ActivityLogType;
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
      contributionCount: d.contributionCount,
    }));
  }
  async getStreakCalendar(
    clerkUserId: string,
    days = 90,
  ): Promise<{ date: string; active: boolean }[]> {
    const from = new Date();
    from.setDate(from.getDate() - days);

    const daily = await this.repo.getDailyActivities(
      clerkUserId,
      from.toISOString().split('T')[0],
    );

    return daily.map(d => ({
      date: d.date,
      active: d.didCoding || d.didHr || d.didAptitude,
    }));
  }

  /* ---------- HELPERS ---------- */

  private mapType(eventType: ActivityLogType): ActivityHistoryDto['type'] {
    if (eventType.startsWith('coding:')) return 'coding';
    if (eventType.startsWith('hr:')) return 'hr';
    return 'aptitude';
  }

  private buildTitle(log: ActivityLog): string {
    switch (log.eventType) {
      case ActivityLogType.CODING_SUBMITTED:
      case ActivityLogType.CODING_ACCEPTED:
        return log.metadata?.title ?? 'Coding Problem';
      case ActivityLogType.HR_START:
      case ActivityLogType.HR_COMPLETE:
        return 'HR Mock Interview';
      case ActivityLogType.APTITUDE_START:
      case ActivityLogType.APTITUDE_COMPLETE:
        return log.metadata?.title ?? 'Aptitude Quiz';
      default:
        return 'Activity';
    }
  }

  private buildResult(log: ActivityLog): string | undefined {
    if (log.eventType === ActivityLogType.CODING_ACCEPTED) {
      return 'Accepted';
    }
    if (log.eventType === ActivityLogType.HR_COMPLETE) {
      return log.metadata?.confidence
        ? `${log.metadata.confidence}% confidence`
        : undefined;
    }
    if (log.eventType === ActivityLogType.APTITUDE_COMPLETE) {
      return log.metadata?.score != null
        ? `${log.metadata.score} correct`
        : undefined;
    }
    return undefined;
  }
}

