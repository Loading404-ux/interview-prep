import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

/* ---------- SESSION ---------- */

export class StartHrSessionDto {
  @IsMongoId()
  userId: string;

  @IsString()
  clerkUserId: string;
}

/* ---------- QUESTION VIEW ---------- */

export class HrQuestionViewDto {
  id: string;
  question: string;
  preferred_answer?: string;
}

/* ---------- ANSWER SUBMISSION ---------- */

export class SubmitHrAnswerDto {
  @IsMongoId()
  sessionId: string;

  @IsMongoId()
  questionId: string;

  // Optional fallback (dev/admin only)
  @IsOptional()
  @IsString()
  transcript?: string;
}


/* ---------- AI RESULT ---------- */

export class HrAiResultDto {
  clarity: number;
  structure: number;
  confidence: number;
  improvementTips: string[];
  generatedPreferredAnswer: string;
}

export class CompleteSessionDto extends StartHrSessionDto {
  @IsMongoId()
  sessionId: string;
}