import { CodingSubmission } from 'src/schema/coding-submission.schema';
import { CodingDiscussion } from 'src/schema/coding-discussion.schema';
import { CodingQuestion } from 'src/schema/coding-questions.schema';

export type DiscussionWithUser = Omit<CodingDiscussion, 'userId'> & {
  userId?: {
    name: string;
  };
};
export class CodingSubmissionMapper {
  static toResponse(submission: any) {
    const authorName = submission.author?.name ?? submission.user?.name;
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
      isLiked: submission.isLiked ?? false,
      author: authorName,
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
    const createdAt = d.createdAt ?? d.createAt;
    return {
      id: d._id,
      questionId: d.questionId,
      parentId: d.parentId,
      content: d.content,
      upvotes: d.upvotes,
      replyCount: d.replyCount,
      createdAt,
      author: d.user?.name,
      isLiked: d.isLiked ?? false,
      _id: undefined,
    };
  }
  static toCreateResponse(d: CodingDiscussion) {
    const createdAt = (d as any).createdAt ?? d.createAt;
    return {
      id: d._id,
      questionId: d.questionId,
      parentId: d.parentId,
      content: d.content,
      upvotes: d.upvotes,
      replyCount: d.replyCount,
      createdAt,
      _id: undefined,
    };
  }
}
