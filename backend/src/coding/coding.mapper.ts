import { CodingSubmission } from 'src/schema/coding-submission.schema';
import { CodingDiscussion } from 'src/schema/coding-discussion.schema';

export class CodingSubmissionMapper {
  static toResponse(submission: CodingSubmission) {
    return {
      id: submission._id,
      questionId: submission.questionId,
      solution: submission.solution,
      explanation: submission.explanation,
      verdict: submission.verdict,
      aiFeedback: submission.aiFeedback,
      upvotes: submission.upvotes ?? 0,
      createdAt: submission.createdAt,
    };
  }
}

export class CodingDiscussionMapper {
  static toResponse(d: CodingDiscussion) {
    return {
      id: d._id,
      questionId: d.questionId,
      parentId: d.parentId,
      content: d.content,
      upvotes: d.upvotes,
      replyCount: d.replyCount,
      createdAt: d.createAt,
    };
  }
}
