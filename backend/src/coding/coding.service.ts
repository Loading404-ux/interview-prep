import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CodingDiscussionRepository, CodingQuestionRepository, CodingRepository, CodingSubmissionRepository } from './coding.repository';
import {
    CodingDiscussionDto,
    CodingSubmissionDto,
    DiscussionVoteDto,
    SubmisstionVoteDto,
} from './coding.dto';
import { ActivityService } from 'src/activity/activity.service';
import { AiService } from 'src/ai/ai.service';
import { SubmissionVerdict } from 'src/schema/coding-submission.schema';
import { CodingDiscussionMapper, CodingSubmissionMapper } from './coding.mapper';
import { CodingDiscussion } from 'src/schema/coding-discussion.schema';
import { UserProgressService } from 'src/user/user-progress.service';
import { ActivityLogType } from 'src/schema/activity-log.schema';

@Injectable()
// export class CodingService {
//     constructor(
//         private readonly repo: CodingRepository,
//         private readonly activityService: ActivityService,
//         private readonly aiService: AiService,
//         private readonly progressService: UserProgressService,

//     ) { }
//     async getQuestions() {
//         return await this.repo.getQuestions();
//     }
//     async getQuestion(id: string) {
//         return await this.repo.getQuestionById(id);
//     }
//     async submitSolution(user: any, dto: CodingSubmissionDto) {
//         const submission = await this.repo.createSubmission({
//             userId: user._id,
//             clerkUserId: user.clerkUserId,
//             questionId: new Types.ObjectId(dto.questionId),
//             solution: dto.solutionText,
//             explanation: dto.explanation,
//         });

//         await this.activityService.record({
//             userId: new Types.ObjectId(user._id),
//             clerkUserId: user.clerkUserId,
//             eventType: 'CODING_SUBMIT',
//             referenceId: submission._id,
//         });

//         void this.triggerAiReview(submission._id.toString(), user);

//         return CodingSubmissionMapper.toResponse(submission);
//     }

//     async toggleSubmissionVote(user: any, dto: SubmisstionVoteDto) {
//         const submission = await this.repo.findSubmissionById(dto.submissionId);
//         if (!submission) throw new NotFoundException('Submission not found');

//         if (submission.verdict !== SubmissionVerdict.ACCEPTED) {
//             throw new ForbiddenException('Only accepted solutions can be upvoted');
//         }

//         const vote = await this.repo.findSubmissionVote(
//             user._id,
//             dto.submissionId,
//         );

//         if (vote) {
//             await this.repo.deleteSubmissionVote(vote._id);
//             await this.repo.incrementSubmissionUpvotes(submission._id, -1);
//             return { voted: false };
//         }

//         await this.repo.createSubmissionVote(
//             user._id,
//             dto.submissionId,
//             user.clerkUserId,
//         );
//         await this.repo.incrementSubmissionUpvotes(submission._id, 1);
//         return { voted: true };
//     }

//     async createDiscussion(user: any, dto: CodingDiscussionDto) {
//         let parent: CodingDiscussion | null = null;
//         console.log(parent)
//         const data = {
//             userId: user._id,
//             clerkUserId: user.clerkUserId,
//             questionId: new Types.ObjectId(dto.questionId),

//             content: dto.content,
//         }
//         if (dto.parentId) {
//             parent = await this.repo.findDiscussionById(dto.parentId);
//             if (!parent || parent.parentId) {
//                 throw new BadRequestException('Invalid parent discussion');
//             }
//             data['parentId'] = parent._id
//         }

//         const discussion = await this.repo.createDiscussion(data);

//         if (parent) {
//             await this.repo.incrementReplyCount(parent._id);
//         }

//         return CodingDiscussionMapper.toResponse(discussion);
//     }

//     async toggleDiscussionVote(user: any, dto: DiscussionVoteDto) {
//         const discussion = await this.repo.findDiscussionById(dto.discussionId);
//         if (!discussion) throw new NotFoundException('Discussion not found');

//         const vote = await this.repo.findDiscussionVote(
//             user._id,
//             dto.discussionId,
//         );

//         if (vote) {
//             await this.repo.deleteDiscussionVote(vote._id);
//             await this.repo.incrementDiscussionUpvotes(discussion._id, -1);
//             return { voted: false };
//         }

//         await this.repo.createDiscussionVote(
//             user._id,
//             dto.discussionId,
//             user.clerkUserId,
//         );
//         await this.repo.incrementDiscussionUpvotes(discussion._id, 1);
//         return { voted: true };
//     }

//     async getAcceptedSubmissions(questionId: string) {
//         return this.repo.getAcceptedSubmissions(questionId);
//     }

//     async getDiscussions(questionId: string) {
//         console.log("kiiii")
//         const data = await this.repo.getDiscussionsByQuestion(questionId);
//         return data ?? [];
//     }

//     async getReplies(discussionId: string) {
//         return this.repo.getReplies(discussionId);
//     }

//     private async triggerAiReview(submissionId: string, user: any) {
//         const submission = await this.repo.findSubmissionWithQuestion(submissionId);
//         if (!submission) return;

//         const review = await this.aiService.aiCodeReview({
//             title: submission.questionId.title,
//             problem: submission.questionId.problem,
//             constraints: submission.questionId.constraints,
//             examples: submission.questionId.examples,
//             topics: submission.questionId.topics,
//             solution: submission.solution,
//             explanation: submission.explanation,
//         });

//         const updated = await this.repo.updateAiReview(
//             submission._id,
//             review.verdict,
//             review.aiFeedback,
//         );

//         if (updated?.verdict === SubmissionVerdict.ACCEPTED) {
//             await this.activityService.record({
//                 userId: user._id,
//                 clerkUserId: user.clerkUserId,
//                 eventType: 'CODING_APPROVED',
//                 referenceId: updated._id,
//             });
//             await this.progressService.onCodingAccepted({
//                 userId: user._id,
//                 clerkUserId: user.clerkUserId,
//             });
//         }
//     }
// }


//NOTE: questions: questions.map(HrMapper.toQuestionView), MAP LIKE THIS 

export class CodingService {
    constructor(
        private readonly questionRepo: CodingQuestionRepository,
        private readonly submissionRepo: CodingSubmissionRepository,
        private readonly discussionRepo: CodingDiscussionRepository,

        private readonly aiService: AiService,

        private readonly activityService: ActivityService,
        private readonly progressService: UserProgressService,
    ) { }

    //------------Question-------------
    async getQuestions() {
        return await this.questionRepo.getQuestions();
    }

    async questionById(id: string) {
        return await this.questionRepo.getQuestionById(id);
    }

    // -----------Submission------------
    async addSubmission(userId: string, clerkUserId: string, dto: CodingSubmissionDto) {
        const submission = await this.submissionRepo.submitSolution(new Types.ObjectId(userId), clerkUserId, dto);

        //TODO: Background Job Use Kafka..!
        await this.activityService.record({
            userId: new Types.ObjectId(userId),
            clerkUserId: clerkUserId,
            eventType: ActivityLogType.CODING_SUBMIT,
            referenceId: submission._id,
        });

        await this.triggerAiReview(submission._id.toString());
        return true;
    }

    async toggleSubmissionVotes(userId: string, clerkUserId: string, dto: SubmisstionVoteDto) {
        const vote = await this.submissionRepo.findVote(new Types.ObjectId(userId), dto.submissionId, clerkUserId);
        if (!vote) {
            await this.submissionRepo.createVote(new Types.ObjectId(userId), dto.submissionId, clerkUserId);
            await this.submissionRepo.updateVote(new Types.ObjectId(userId), 1);
        } else {
            await this.submissionRepo.deleteVote(new Types.ObjectId(userId), dto.submissionId, clerkUserId);
            await this.submissionRepo.updateVote(new Types.ObjectId(userId), -1);
        }
        return true;
    }

    async getSubmissionsByQuestion(questionId: string) {
        return await this.submissionRepo.getSubmissionsByQuestionId(questionId);
    }


    // -----------Discussion------------
    async addDiscussion(userId: string, text: string, parentId?: string) {
        const discussion = await this.discussionRepo.newDiscussion({ userId: new Types.ObjectId(userId), content: text, parentId: parentId ? new Types.ObjectId(parentId) : null });
        if (parentId) {
            await this.discussionRepo.increateReplyCount(new Types.ObjectId(parentId));
        }
        return discussion;
    }

    async getDiscussions(questionId: string) {
        return await this.discussionRepo.getDiscussionsByQuestion(questionId);
    }
    async toggleDiscussionVotes(userId: string, clerkUserId: string, dto: DiscussionVoteDto) {
        const vote = await this.discussionRepo.findVote(new Types.ObjectId(userId), dto.discussionId, clerkUserId);
        if (!vote) {
            await this.discussionRepo.createVote(new Types.ObjectId(userId), dto.discussionId, clerkUserId);
            await this.discussionRepo.updateVote(new Types.ObjectId(userId), 1);
        } else {
            await this.discussionRepo.deleteVote(new Types.ObjectId(userId), dto.discussionId, clerkUserId);
            await this.discussionRepo.updateVote(new Types.ObjectId(userId), -1);
        }
        return true;
    }

    // -------------Ai------------
    private async triggerAiReview(submissionId: string) {
        const submission = await this.submissionRepo.findSubmissionById(submissionId).populate('questionId');
        if (!submission) {
            throw new Error('Submission not found');
        }

        const { solution, questionId, userId, clerkUserId } = submission;
        const question = await this.questionRepo.getQuestionById(questionId);
        if (!question) {
            throw new Error('Submission not found');
        }
        const { title, examples, constraints, problem, topics, difficulty } = question

        const { aiFeedback, verdict } = await this.aiService.aiCodeReview({
            title,
            problem,
            constraints,
            examples,
            topics,
            solution,
            difficulty,
        });

        if (!aiFeedback || !verdict) {
            throw new Error('Ai response is not valid structured JSON');
        }

        await this.submissionRepo.updateValue(new Types.ObjectId(submissionId), { aiFeedback, verdict });
        if (verdict === SubmissionVerdict.ACCEPTED) {

        }
        this.progressService.onCodingAccepted({
            userId: new Types.ObjectId(userId), clerkUserId: clerkUserId, accuracy: (
                (aiFeedback.clarityScore ?? 0) + (aiFeedback.correctnessScore ?? 0)) / 2
        });

    }
}