import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CodingSubmission, SubmissionVerdict } from '../schema/coding-submission.schema';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { SubmissionVote } from 'src/schema/coding-submission-vote.schema';
import { DiscussionVote } from 'src/schema/coding-discussion-vote.schema';
import { CodingDiscussion } from 'src/schema/coding-discussion.schema';
import { CodingDiscussionDto } from './coding.dto';
// import { SubmissionVerdict } from '../schemas/enums';

@Injectable()
export class CodingRepository {
    constructor(
        @InjectModel(CodingSubmission.name)
        private readonly submissionModel: Model<CodingSubmission>,
        @InjectModel(SubmissionVote.name)
        private readonly submissionVoteModel: Model<SubmissionVote>,

        @InjectModel(CodingSubmission.name)
        private readonly discussionModel: Model<CodingDiscussion>,
        @InjectModel(SubmissionVote.name)
        private readonly discussionVoteModel: Model<DiscussionVote>,
    ) { }

    createInitialSubmission(data: Partial<CodingSubmission>): Promise<CodingSubmission> {
        return this.submissionModel.create({
            ...data,
            verdict: SubmissionVerdict.NEEDS_IMPROVEMENT,
        });
    }

    updateAiReview(
        submissionId: string,
        verdict: SubmissionVerdict,
        aiFeedback: any
    ) {
        return this.submissionModel.findByIdAndUpdate(
            submissionId,
            { verdict, aiFeedback },
            { new: true }
        );
    }

    findBySubmissionId(submissionId: string) {
        return this.submissionModel
            .findOne({ submissionId })
    }

    getAllSubmissionByUser(userId: string) {
        return this.submissionModel
            .find({ userId })
            .sort({ createdAt: -1 });
    }

    findSubmissionVote(userId: string, submissionId: string) {
        return this.submissionVoteModel.findOne({ userId, submissionId });
    }

    newSubmissionVote(userId: string, submissionId: string) {
        return this.submissionVoteModel.create({ userId, submissionId });
    }

    updateSubmissionVoteCount(
        { submissionId,
            userId,
            value
        }: {
            submissionId: Types.ObjectId,
            userId: string,
            value: number
        }
    ) {
        return this.submissionModel.findOneAndUpdate(
            { _id: submissionId, userId },
            { $inc: { upvoteCount: value } },
            { new: true }
        );
    }
    findDiscussionVote(userId: string, discussionId: string) {
        return this.discussionVoteModel.findOne({ userId, discussionId });
    }

    newDiscussionVote(userId: string, discussionId: string) {
        return this.discussionVoteModel.create({ userId, discussionId });
    }

    updateDiscussionVoteCount({ discussionId, userId, value }: { discussionId: Types.ObjectId, userId: string, value: number }) {
        return this.discussionModel.findOneAndUpdate(
            { _id: discussionId, userId },
            { $inc: { upvoteCount: value } },
            { new: true }
        );
    }

    createDiscussion(data: CodingDiscussionDto): Promise<CodingDiscussion> {
        return this.discussionModel.create(data);
    }

    findByDiscussionId(id: string): Promise<CodingDiscussion | null> {
        return this.discussionModel.findById(id);
    }
    findByDiscussionsByQuestionId(id: string): Promise<CodingDiscussion[] | null> {
        return this.discussionModel.find({questionId:id});
    }

    incrementDiscussionReplyCount(id: Types.ObjectId): Promise<void> {
        return this.discussionModel.updateOne(
            { _id: id },
            { $inc: { replyCount: 1 } }
        ).then(() => undefined);
    }

    findDiscussionRootComments(questionId: Types.ObjectId) {
        return this.discussionModel
            .find({
                questionId,
                parentId: null,
                isDeleted: false,
            })
            .sort({ createdAt: -1 });
    }

    findDiscussionReplies(parentId: Types.ObjectId) {
        return this.discussionModel
            .find({
                parentId,
                isDeleted: false,
            })
            .sort({ createdAt: 1 });
    }


    async findRootCommentsPaginated(
        questionId: Types.ObjectId,
        limit: number,
        cursor?: string
    ) {
        const query: any = {
            questionId,
            parentId: null,
            isDeleted: false,
        };

        if (cursor) {
            query.createdAt = { $lt: new Date(cursor) };
        }

        return this.discussionModel
            .find(query)
            .sort({ createdAt: -1 })
            .limit(limit + 1); // fetch extra for nextCursor
    }
    // async createDiscussion(data: Partial<CodingDiscussion>): Promise<CodingDiscussion> {

    // }

}
