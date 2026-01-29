import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CodingQuestion } from 'src/schema/coding-questions.schema';
import { CodingSubmission, SubmissionVerdict } from 'src/schema/coding-submission.schema';
import { CodingDiscussion } from 'src/schema/coding-discussion.schema';
import { SubmissionVote } from 'src/schema/coding-submission-vote.schema';
import { DiscussionVote } from 'src/schema/coding-discussion-vote.schema';
import { CodingSubmissionDto } from './coding.dto';
type CodingSubmissionPopulated =
    Omit<CodingSubmission, 'questionId'> & {
        questionId: CodingQuestion;
    };
// @Injectable()
// export class CodingRepository {
//     constructor(
//         @InjectModel(CodingQuestion.name)
//         private readonly questionModel: Model<CodingQuestion>,

//         @InjectModel(CodingSubmission.name)
//         private readonly submissionModel: Model<CodingSubmission>,

//         @InjectModel(SubmissionVote.name)
//         private readonly submissionVoteModel: Model<SubmissionVote>,

//         @InjectModel(CodingDiscussion.name)
//         private readonly discussionModel: Model<CodingDiscussion>,

//         @InjectModel(DiscussionVote.name)
//         private readonly discussionVoteModel: Model<DiscussionVote>,
//     ) { }

//     /* ---------- QUESTIONS ---------- */

//     createQuestion(data: Partial<CodingQuestion>) {
//         return this.questionModel.create(data);
//     }

//     getQuestions() {
//         return this.questionModel.find().sort({ createdAt: -1 }).lean()
//             .then(docs =>
//                 docs.map(({ _id, ...rest }) => ({
//                     id: _id.toString(),
//                     ...rest,
//                 }))
//             );
//     }

//     async getQuestionById(id: string) {
//         const doc = await this.questionModel.findById(id).lean();

//         if (!doc) return null;

//         const { _id, ...rest } = doc;

//         return {
//             id: _id.toString(),
//             ...rest,
//         };
//     }

//     /* ---------- SUBMISSIONS ---------- */

//     createSubmission(data: Partial<CodingSubmission>) {
//         return this.submissionModel.create({
//             ...data,
//             verdict: SubmissionVerdict.NEEDS_IMPROVEMENT,
//         });
//     }

//     findSubmissionById(id: string) {
//         return this.submissionModel.findById(id);
//     }

//     async findSubmissionWithQuestion(
//         submissionId: string,
//     ): Promise<CodingSubmissionPopulated | null> {
//         return this.submissionModel
//             .findOne({ submissionId })
//             .populate<{ questionId: CodingQuestion }>('questionId')
//             .exec() as Promise<CodingSubmissionPopulated | null>;
//     }

//     updateAiReview(
//         id: Types.ObjectId,
//         verdict: SubmissionVerdict,
//         aiFeedback: any,
//     ) {
//         return this.submissionModel.findByIdAndUpdate(
//             id,
//             { verdict, aiFeedback },
//             { new: true },
//         );
//     }

//     incrementSubmissionUpvotes(id: Types.ObjectId, value: number) {
//         return this.submissionModel.updateOne(
//             { _id: id },
//             { $inc: { upvotes: value } },
//         );
//     }

//     getAcceptedSubmissions(questionId: string) {
//         return this.submissionModel
//             .find({
//                 questionId,
//                 verdict: SubmissionVerdict.ACCEPTED,
//             })
//             .sort({ upvotes: -1, createdAt: -1 });
//     }

//     /* ---------- SUBMISSION VOTES ---------- */

//     findSubmissionVote(userId: Types.ObjectId, submissionId: string) {
//         return this.submissionVoteModel.findOne({
//             userId,
//             submissionId,
//         });
//     }

//     createSubmissionVote(userId: Types.ObjectId, submissionId: string, clerkUserId: string) {
//         return this.submissionVoteModel.create({
//             userId,
//             submissionId,
//             clerkUserId,
//         });
//     }

//     deleteSubmissionVote(id: Types.ObjectId) {
//         return this.submissionVoteModel.deleteOne({ _id: id });
//     }

//     /* ---------- DISCUSSIONS ---------- */

//     createDiscussion(data: Partial<CodingDiscussion>) {
//         return this.discussionModel.create(data);
//     }

//     findDiscussionById(id: string) {
//         return this.discussionModel.findById(id);
//     }

//     incrementDiscussionUpvotes(id: Types.ObjectId, value: number) {
//         return this.discussionModel.updateOne(
//             { _id: id },
//             { $inc: { upvotes: value } },
//         );
//     }

//     incrementReplyCount(id: Types.ObjectId) {
//         return this.discussionModel.updateOne(
//             { _id: id },
//             { $inc: { replyCount: 1 } },
//         );
//     }

//     getDiscussionsByQuestion(questionId: string) {
//         return this.discussionModel
//             .find({ questionId: new Types.ObjectId(questionId), parentId: null, isDeleted: false })
//             .sort({ createdAt: -1 });
//     }

//     getReplies(parentId: string) {
//         return this.discussionModel
//             .find({ parentId, isDeleted: false })
//             .sort({ createdAt: 1 });
//     }

//     /* ---------- DISCUSSION VOTES ---------- */

//     findDiscussionVote(userId: Types.ObjectId, discussionId: string) {
//         return this.discussionVoteModel.findOne({
//             userId,
//             discussionId,
//         });
//     }

//     createDiscussionVote(userId: Types.ObjectId, discussionId: string, clerkUserId: string) {
//         return this.discussionVoteModel.create({
//             userId,
//             discussionId,
//             clerkUserId,
//         });
//     }

//     deleteDiscussionVote(id: Types.ObjectId) {
//         return this.discussionVoteModel.deleteOne({ _id: id });
//     }
// }


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
        @InjectModel(SubmissionVote.name)
        private readonly submissionModel: Model<CodingSubmission>,

        @InjectModel(SubmissionVote.name)
        private readonly voteModel: Model<SubmissionVote>,
    ) { }

    submitSolution(userId: Types.ObjectId,clerkUserId: string, data: CodingSubmissionDto) {
        return this.submissionModel.create({...data, userId,clerkUserId});
    }
    getSubmissionsByQuestionId(questionId: string) {
        return this.submissionModel
            .find({ questionId: new Types.ObjectId(questionId) })
            .sort({ createdAt: -1 }).limit(49);
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
    createVote(userId: Types.ObjectId, submissionId: string, clerkUserId: string) {
        return this.voteModel.create({
            userId,
            submissionId,
            clerkUserId,
        });
    }
    findVote(userId: Types.ObjectId, submissionId: string, clerkUserId: string) {
        return this.voteModel.create({
            userId,
            submissionId,
            clerkUserId,
        });
    }
    deleteVote(userId: Types.ObjectId, submissionId: string, clerkUserId: string) {
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

    getDiscussionsByQuestion(questionId: string) {
        return this.discussionModel
            .find({ questionId: new Types.ObjectId(questionId), parentId: null, isDeleted: false })
            .sort({ createdAt: -1 })
            .limit(49);
    }

    findDiscussionById(id: string) {
        return this.discussionModel.findById(id);
    }

    updateVote(id: Types.ObjectId, value: number) {
        return this.discussionModel.updateOne(
            { _id: id },
            { $inc: { upvotes: value } },
        );
    }

    createVote(userId: Types.ObjectId, discussionId: string, clerkUserId: string) {
        return this.voteModel.create({
            userId,
            discussionId,
            clerkUserId,
        });
    }
    findVote(userId: Types.ObjectId, discussionId: string, clerkUserId: string) {
        return this.voteModel.create({
            userId,
            discussionId,
            clerkUserId,
        });
    }
    deleteVote(userId: Types.ObjectId, discussionId: string, clerkUserId: string) {
        return this.voteModel.findOneAndDelete({ userId, discussionId, clerkUserId });
    }
    increateReplyCount(id: Types.ObjectId) {
        return this.discussionModel.updateOne(
            { _id: id },
            { $inc: { replyCount: 1 } },
        );
    }

    updateValue(id: Types.ObjectId, value: number) {
        return this.discussionModel.findByIdAndUpdate(
            id,
            { $inc: { value } },
            { new: true }
        );
    }
}