import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CodingQuestion } from 'src/schema/coding-questions.schema';
import { CodingSubmission, SubmissionVerdict } from 'src/schema/coding-submission.schema';
import { CodingDiscussion } from 'src/schema/coding-discussion.schema';
import { SubmissionVote } from 'src/schema/coding-submission-vote.schema';
import { DiscussionVote } from 'src/schema/coding-discussion-vote.schema';
import { CodingSubmissionDto } from './coding.dto';


@Injectable()
export class CodingQuestionRepository {
    constructor(
        @InjectModel(CodingQuestion.name)
        private readonly questionModel: Model<CodingQuestion>

    ) { }

    createQuestion(data: Partial<CodingQuestion>) {
        return this.questionModel.create(data);
    }

    getQuestions() {
        return this.questionModel.aggregate([
            { $sort: { createdAt: -1 } },
            { $project: { id: '$_id', title: 1, description: 1, difficulty: 1, company: 1 } }
        ])
    }
    getQuestionById(id: string | Types.ObjectId) {
        return this.questionModel.findById(id);
    }
}

@Injectable()
export class CodingSubmissionRepository {
    constructor(
        @InjectModel(CodingSubmission.name)
        private readonly submissionModel: Model<CodingSubmission>,

        @InjectModel(SubmissionVote.name)
        private readonly voteModel: Model<SubmissionVote>,
    ) { }

    submitSolution(userId: Types.ObjectId, clerkUserId: string, data: CodingSubmissionDto) {
        return this.submissionModel.create({
            userId,
            clerkUserId,
            questionId: new Types.ObjectId(data.questionId),
            solution: data.solutionText,
            explanation: data.explanation,
            verdict: SubmissionVerdict.NEEDS_IMPROVEMENT,
        });
    }
    getSubmissionsByQuestionId(questionId: string, userId) {
        // return this.submissionModel
        //     .find({ questionId: new Types.ObjectId(questionId) })
        //     .sort({ createdAt: -1 }).limit(49);

        return this.submissionModel.aggregate([
            {
                $match: {
                    questionId: new Types.ObjectId(questionId)
                },
            },
            {
                $lookup: {
                    from: "submissionvotes",
                    let: { submissionId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$submissionId', '$$submissionId'] },
                                        { $eq: ['$userId', new Types.ObjectId(userId)] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'userVotes',
                },
            },
            {
                $addFields: {
                    isLiked: { $gt: [{ $size: '$userVotes' }, 0] },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            { $unwind: '$user' },
            {
                $project: {
                    userVotes: 0,
                    'user._id': 0,
                    'user.email': 0,
                },
            },
            { $sort: { createdAt: -1 } },
            { $limit: 49 },
        ])
    }

    findSubmissionById(id: string) {
        return this.submissionModel.findById(id);
    }

    updateVote(submissionId: Types.ObjectId, value: number) {
        return this.submissionModel.updateOne(
            { _id: submissionId },
            { $inc: { upvotes: value } },
        );
    }
    createVote(userId: Types.ObjectId, submissionId: Types.ObjectId, clerkUserId: string) {
        return this.voteModel.create({
            userId,
            submissionId,
            clerkUserId,
        });
    }
    findVote(userId: Types.ObjectId, submissionId: Types.ObjectId, clerkUserId: string) {
        return this.voteModel.findOne({
            userId,
            submissionId,
            clerkUserId,
        });
    }
    deleteVote(userId: Types.ObjectId, submissionId: Types.ObjectId, clerkUserId: string) {
        return this.voteModel.findOneAndDelete({ userId, submissionId, clerkUserId });
    }
    updateValue(id: Types.ObjectId, data: Partial<CodingSubmission>) {
        return this.submissionModel.findByIdAndUpdate(
            id,
            { ...data },
            { new: true }
        );
    }
}

@Injectable()
export class CodingDiscussionRepository {
    constructor(
        @InjectModel(CodingDiscussion.name)
        private readonly discussionModel: Model<CodingDiscussion>,

        @InjectModel(DiscussionVote.name)
        private readonly voteModel: Model<DiscussionVote>,
    ) { }

    newDiscussion(data: Partial<CodingDiscussion>) {
        return this.discussionModel.create(data);
    }

    getDiscussionsByQuestion(
        questionId: string,
        parentId: string | null,
        userId: string,
    ) {
        return this.discussionModel.aggregate([
            {
                $match: {
                    questionId: new Types.ObjectId(questionId),
                    parentId: parentId ? new Types.ObjectId(parentId) : null,
                    isDeleted: false,
                },
            },
            {
                $lookup: {
                    from: "discussionvotes",
                    let: { discussionId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$discussionId', '$$discussionId'] },
                                        { $eq: ['$userId', new Types.ObjectId(userId)] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'userVotes',
                },
            },
            {
                $addFields: {
                    isLiked: { $gt: [{ $size: '$userVotes' }, 0] },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            { $unwind: '$user' },
            {
                $project: {
                    userVotes: 0,
                    'user._id': 0,
                    'user.email': 0,
                },
            },
            { $sort: { createdAt: -1 } },
            { $limit: 49 },
        ]);
    }



    updateVote(id: Types.ObjectId, value: number) {
        return this.discussionModel.updateOne(
            { _id: id },
            { $inc: { upvotes: value } },
        );
    }

    createVote(userId: Types.ObjectId, discussionId: Types.ObjectId, clerkUserId: string) {
        return this.voteModel.create({
            userId,
            discussionId,
            clerkUserId,
        });
    }

    findVote(userId: Types.ObjectId, discussionId: Types.ObjectId, clerkUserId: string) {
        return this.voteModel.findOne({
            userId,
            discussionId,
            clerkUserId,
        });
    }
    deleteVote(userId: Types.ObjectId, discussionId: Types.ObjectId, clerkUserId: string) {
        return this.voteModel.findOneAndDelete({ userId, discussionId, clerkUserId });
    }
    increateReplyCount(id: Types.ObjectId) {
        return this.discussionModel.updateOne(
            { _id: id },
            { $inc: { replyCount: 1 } },
        );
    }
}