import { CodingSubmission } from 'src/schema/coding-submission.schema';
import { CodingDiscussion } from 'src/schema/coding-discussion.schema';
import { CodingQuestion } from 'src/schema/coding-questions.schema';
import { User } from 'src/schema/user.schema';

export type DiscussionWithUser = Omit<CodingDiscussion, 'userId'> & {
  userId?: {
    name: string;
  };
};
export class CodingSubmissionMapper {
  static toResponse(submission: any) {
    return {
      id: submission._id,
      questionId: submission.questionId,
      solution: submission.solution,
      explanation: submission.explanation,
      verdict: submission.verdict,
      aiFeedback: submission.aiFeedback,
      upvotes: submission.upvotes ?? 0,
      createdAt: submission.createdAt,
      _id: undefined,
      isLiked: submission.isLiked,
      author: submission.author.name,
    };
  }
}
export class CodingQuestionMapper {
  static toResponse(question: Partial<CodingQuestion>) {
    return {
      ...question,
      id: question._id?.toString(),
      _id: undefined,
    };
  }
}



export class CodingDiscussionMapper {
  static toResponse(d: any) {
    return {
      id: d._id,
      questionId: d.questionId,
      parentId: d.parentId,
      content: d.content,
      upvotes: d.upvotes,
      replyCount: d.replyCount,
      createdAt: d.createAt,
      author: d.user?.name,
      isLiked: d.isLiked,
      _id: undefined,
    };
  }
  static toCreateResponse(d: CodingDiscussion) {
    return {
      id: d._id,
      questionId: d.questionId,
      parentId: d.parentId,
      content: d.content,
      upvotes: d.upvotes,
      replyCount: d.replyCount,
      createdAt: d.createAt,
      _id: undefined,
    };
  }
}
