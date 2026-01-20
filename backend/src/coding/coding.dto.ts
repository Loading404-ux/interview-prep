import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCodingSubmissionDto {

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