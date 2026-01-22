type ActivityEventType =
  | 'CODING_SUBMIT'
  | 'HR_SESSION_COMPLETE'
  | 'APTITUDE_ATTEMPT';

  export class ActivityHistoryDto {
  id: string;
  type: 'coding' | 'hr' | 'aptitude';
  title: string;
  description: string;
  date: Date;
  result?: string;
}

export class ContributionDayDto {
  date: string;       // YYYY-MM-DD
  verified: boolean;  // did anything that day
}
