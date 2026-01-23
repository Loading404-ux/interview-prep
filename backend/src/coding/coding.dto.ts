import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

/* ---------- QUESTIONS ---------- */

export class CreateCodingQuestionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  difficulty: string;

  @IsOptional()
  @IsString({ each: true })
  topics?: string[];

  @IsOptional()
  @IsString()
  company?: string;

  @IsString()
  @IsNotEmpty()
  problem: string;

  @IsString()
  @IsNotEmpty()
  hint: string;
}

/* ---------- SUBMISSION ---------- */

export class CodingSubmissionDto {
  @IsMongoId()
  questionId: string;

  @IsString()
  @IsNotEmpty()
  solutionText: string;

  @IsOptional()
  @IsString()
  explanation?: string;
}

export class SubmisstionVoteDto {
  @IsMongoId()
  submissionId: string;
}

/* ---------- DISCUSSION ---------- */

export class CodingDiscussionDto {
  @IsMongoId()
  questionId: string;

  @IsOptional()
  @IsMongoId()
  parentId?: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}

export class DiscussionVoteDto {
  @IsMongoId()
  discussionId: string;
}
