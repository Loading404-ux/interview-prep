export class ActivityHistoryDto {
  id: string;
  type: 'coding' | 'hr' | 'aptitude';
  title: string;
  description: string;
  date: Date;
  result?: string;
}

export class ContributionDayDto {
  date: string; // YYYY-MM-DD
  contributionCount: number; // did anything that day
}
