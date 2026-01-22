import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

export class CodingSubmissionResponseDto {
  id: string;
  questionId: string;
  verdict: string;
  reviewedBy: string;
  createdAt: Date;
}

export class CodingDiscussionDto {
  @IsMongoId()
  questionId: string;


  @IsString()
  content: string;

  @IsMongoId()
  @IsOptional()
  parentId?: string;
}

export class UserIDsDto {
  @IsMongoId()
  userId: string;
  @IsString()
  clerkUserId: string;
}

export class DiscussionVoteDto extends UserIDsDto {
  @IsMongoId()
  discussionId: string
}

export class SubmisstionVoteDto extends UserIDsDto {
  @IsMongoId()
  submissionId: string
}