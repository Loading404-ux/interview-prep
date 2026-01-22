import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ActivityLog } from 'src/schema/activity-log.schema';
import { ActivityRepository } from './activity.repository';

@Injectable()
export class ActivityService {
  constructor(private readonly repo: ActivityRepository) {}

  /* ---------- WRITE (CALLED FROM OTHER MODULES) ---------- */

  async recordActivity({
    userId,
    clerkUserId,
    eventType,
    referenceId,
    metadata,
  }: {
    userId: Types.ObjectId;
    clerkUserId: string;
    eventType: 'CODING_SUBMIT' | 'HR_SESSION_COMPLETE' | 'APTITUDE_ATTEMPT';
    referenceId?: Types.ObjectId;
    metadata?: Record<string, any>;
  }) {
    const date = new Date().toISOString().split('T')[0];

    const typeMap = {
      CODING_SUBMIT: 'coding',
      HR_SESSION_COMPLETE: 'hr',
      APTITUDE_ATTEMPT: 'aptitude',
    } as const;

    const type = typeMap[eventType];

    await this.repo.logEvent({
      userId,
      clerkUserId,
      eventType,
      referenceId,
      metadata,
    });

    await this.repo.upsertDailyActivity({
      userId,
      clerkUserId,
      date,
      type,
    });
  }

  /* ---------- HISTORY ---------- */

  async getHistory(userId: Types.ObjectId) {
    const logs = await this.repo.getRecentActivities(userId);

    return logs.map(log => ({
      id: log._id.toString(),
      type: this.mapType(log.eventType),
      title: this.buildTitle(log),
      description: log.description ?? '',
      date: log.createdAt,
      result: this.buildResult(log),
    }));
  }

  /* ---------- CONTRIBUTIONS ---------- */

  async getContributionCalendar(userId: Types.ObjectId, days = 90) {
    const from = new Date();
    from.setDate(from.getDate() - days);

    const daily = await this.repo.getDailyActivities(
      userId,
      from.toISOString().split('T')[0],
    );

    return daily.map(d => ({
      date: d.date,
      verified: d.contributionCount > 0,
    }));
  }

  async getStreakData(userId: Types.ObjectId, days = 30) {
    const from = new Date();
    from.setDate(from.getDate() - days);

    const daily = await this.repo.getDailyActivities(
      userId,
      from.toISOString().split('T')[0],
    );

    return daily.map(d => ({
      date: d.date,
      count: d.contributionCount,
    }));
  }

  /* ---------- HELPERS ---------- */

  private mapType(eventType: string) {
    if (eventType.startsWith('CODING')) return 'coding';
    if (eventType.startsWith('HR')) return 'hr';
    return 'aptitude';
  }

  private buildTitle(log: ActivityLog) {
    switch (log.eventType) {
      case 'CODING_SUBMIT':
        return log.metadata?.problemTitle ?? 'Coding Problem';
      case 'HR_SESSION_COMPLETE':
        return 'HR Mock Interview';
      case 'APTITUDE_ATTEMPT':
        return log.metadata?.quizTitle ?? 'Aptitude Quiz';
      default:
        return 'Activity';
    }
  }

  private buildResult(log: ActivityLog) {
    if (log.eventType === 'HR_SESSION_COMPLETE') {
      return `${log.metadata?.confidence ?? 0}% confidence`;
    }
    if (log.eventType === 'APTITUDE_ATTEMPT') {
      return `${log.metadata?.score ?? '—'} correct`;
    }
    if (log.eventType === 'CODING_SUBMIT') {
      return log.metadata?.verdict ?? 'Submitted';
    }
    return undefined;
  }
}
