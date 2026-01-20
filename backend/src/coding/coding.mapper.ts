import { CodingSubmission, CodingSubmissionDocument } from '../schema/coding-submission.schema';
import { CodingSubmissionResponseDto } from './coding.dto';


export class CodingSubmissionMapper {

  static toResponse(
    submission: CodingSubmission
  ): CodingSubmissionResponseDto {
    return {
      id: submission._id.toString(),
      questionId: submission.questionId.toString(),
      verdict: submission.verdict,
      reviewedBy: submission.reviewedBy,
      createdAt: submission.createdAt,
    };
  }
}
