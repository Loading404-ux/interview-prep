import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CodingQuestion } from 'src/schema/coding-questions.schema';
import { CodingSubmission, SubmissionVerdict } from 'src/schema/coding-submission.schema';
import { CodingDiscussion } from 'src/schema/coding-discussion.schema';
import { SubmissionVote } from 'src/schema/coding-submission-vote.schema';
import { DiscussionVote } from 'src/schema/coding-discussion-vote.schema';
type CodingSubmissionPopulated =
    Omit<CodingSubmission, 'questionId'> & {
        questionId: CodingQuestion;
    };
@Injectable()
export class CodingRepository {
    constructor(
        @InjectModel(CodingQuestion.name)
        private readonly questionModel: Model<CodingQuestion>,

        @InjectModel(CodingSubmission.name)
        private readonly submissionModel: Model<CodingSubmission>,

        @InjectModel(SubmissionVote.name)
        private readonly submissionVoteModel: Model<SubmissionVote>,

        @InjectModel(CodingDiscussion.name)
        private readonly discussionModel: Model<CodingDiscussion>,

        @InjectModel(DiscussionVote.name)
        private readonly discussionVoteModel: Model<DiscussionVote>,
    ) { }

    /* ---------- QUESTIONS ---------- */

    createQuestion(data: Partial<CodingQuestion>) {
        return this.questionModel.create(data);
    }

    getQuestions() {
        return this.questionModel.find().sort({ createdAt: -1 });
    }

    getQuestionById(id: string) {
        return this.questionModel.findById(id);
    }

    /* ---------- SUBMISSIONS ---------- */

    createSubmission(data: Partial<CodingSubmission>) {
        return this.submissionModel.create({
            ...data,
            verdict: SubmissionVerdict.NEEDS_IMPROVEMENT,
        });
    }

    findSubmissionById(id: string) {
        return this.submissionModel.findById(id);
    }

    async findSubmissionWithQuestion(
        submissionId: string,
    ): Promise<CodingSubmissionPopulated | null> {
        return this.submissionModel
            .findOne({ submissionId })
            .populate<{ questionId: CodingQuestion }>('questionId')
            .exec() as Promise<CodingSubmissionPopulated | null>;
    }

    updateAiReview(
        id: Types.ObjectId,
        verdict: SubmissionVerdict,
        aiFeedback: any,
    ) {
        return this.submissionModel.findByIdAndUpdate(
            id,
            { verdict, aiFeedback },
            { new: true },
        );
    }

    incrementSubmissionUpvotes(id: Types.ObjectId, value: number) {
        return this.submissionModel.updateOne(
            { _id: id },
            { $inc: { upvotes: value } },
        );
    }

    getAcceptedSubmissions(questionId: string) {
        return this.submissionModel
            .find({
                questionId,
                verdict: SubmissionVerdict.ACCEPTED,
            })
            .sort({ upvotes: -1, createdAt: -1 });
    }

    /* ---------- SUBMISSION VOTES ---------- */

    findSubmissionVote(userId: Types.ObjectId, submissionId: string) {
        return this.submissionVoteModel.findOne({
            userId,
            submissionId,
        });
    }

    createSubmissionVote(userId: Types.ObjectId, submissionId: string, clerkUserId: string) {
        return this.submissionVoteModel.create({
            userId,
            submissionId,
            clerkUserId,
        });
    }

    deleteSubmissionVote(id: Types.ObjectId) {
        return this.submissionVoteModel.deleteOne({ _id: id });
    }

    /* ---------- DISCUSSIONS ---------- */

    createDiscussion(data: Partial<CodingDiscussion>) {
        return this.discussionModel.create(data);
    }

    findDiscussionById(id: string) {
        return this.discussionModel.findById(id);
    }

    incrementDiscussionUpvotes(id: Types.ObjectId, value: number) {
        return this.discussionModel.updateOne(
            { _id: id },
            { $inc: { upvotes: value } },
        );
    }

    incrementReplyCount(id: Types.ObjectId) {
        return this.discussionModel.updateOne(
            { _id: id },
            { $inc: { replyCount: 1 } },
        );
    }

    getDiscussionsByQuestion(questionId: string) {
        return this.discussionModel
            .find({ questionId, parentId: null, isDeleted: false })
            .sort({ createdAt: -1 });
    }

    getReplies(parentId: string) {
        return this.discussionModel
            .find({ parentId, isDeleted: false })
            .sort({ createdAt: 1 });
    }

    /* ---------- DISCUSSION VOTES ---------- */

    findDiscussionVote(userId: Types.ObjectId, discussionId: string) {
        return this.discussionVoteModel.findOne({
            userId,
            discussionId,
        });
    }

    createDiscussionVote(userId: Types.ObjectId, discussionId: string, clerkUserId: string) {
        return this.discussionVoteModel.create({
            userId,
            discussionId,
            clerkUserId,
        });
    }

    deleteDiscussionVote(id: Types.ObjectId) {
        return this.discussionVoteModel.deleteOne({ _id: id });
    }
}
