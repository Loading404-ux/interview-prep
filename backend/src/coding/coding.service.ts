import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import {
    CodingDiscussionRepository,
    CodingQuestionRepository,
    CodingSubmissionRepository
} from './coding.repository';
import {
    CodingSubmissionDto,
    DiscussionVoteDto,
    SubmisstionVoteDto,
} from './coding.dto';
import { ActivityService } from 'src/activity/activity.service';
import { AiService } from 'src/ai/ai.service';
import { SubmissionVerdict } from 'src/schema/coding-submission.schema';
import { CodingDiscussionMapper, CodingQuestionMapper, CodingSubmissionMapper } from './coding.mapper';
import { UserProgressService } from 'src/user/user-progress.service';
import { ActivityLogType } from 'src/schema/activity-log.schema';


@Injectable()
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
        const question = await this.questionRepo.getQuestionById(id);

        if (!question) return null;

        return CodingQuestionMapper.toResponse(question.toObject());
    }


    // -----------Submission------------
    async addSubmission(userId: string, clerkUserId: string, dto: CodingSubmissionDto) {
        const submission = await this.submissionRepo.submitSolution(new Types.ObjectId(userId), clerkUserId, dto);

        await this.activityService.record({
            userId: new Types.ObjectId(userId),
            clerkUserId: clerkUserId,
            eventType: ActivityLogType.CODING_SUBMITTED,
            referenceId: submission._id,
        });

        await this.triggerAiReview(submission._id.toString());
        return true;
    }

    async toggleSubmissionVotes(userId: string, clerkUserId: string, dto: SubmisstionVoteDto) {
        const vote = await this.submissionRepo.findVote(new Types.ObjectId(userId), new Types.ObjectId(dto.submissionId), clerkUserId);
        let count = 1
        if (!vote) {
            await this.submissionRepo.createVote(new Types.ObjectId(userId), new Types.ObjectId(dto.submissionId), clerkUserId);
            await this.submissionRepo.updateVote(new Types.ObjectId(dto.submissionId), 1);
        } else {
            await this.submissionRepo.deleteVote(new Types.ObjectId(userId), new Types.ObjectId(dto.submissionId), clerkUserId);
            await this.submissionRepo.updateVote(new Types.ObjectId(dto.submissionId), -1);
            count = -1
        }
        return { value: count };
    }

    async getSubmissionsByQuestion(questionId: string, userId: string) {
        return (await this.submissionRepo.getSubmissionsByQuestionId(questionId, userId)).map(CodingSubmissionMapper.toResponse);
    }


    // -----------Discussion------------
    async addDiscussion({ userId, text, questionId, parentId, clerkUserId }: { userId: string, text: string, parentId?: string, clerkUserId: string, questionId: string }) {
        const discussion = await this.discussionRepo.newDiscussion({
            userId: new Types.ObjectId(userId),
            clerkUserId,
            content: text,
            parentId: parentId ? new Types.ObjectId(parentId) : null,
            questionId: new Types.ObjectId(questionId)
        });
        if (parentId) {
            await this.discussionRepo.increateReplyCount(new Types.ObjectId(parentId));
        }

        return CodingDiscussionMapper.toCreateResponse(discussion.toObject());
    }

    async getDiscussions(
        { questionId, parentId, userId }:
            { questionId: string, parentId: string | null, userId: string }) {
        const data = await this.discussionRepo.getDiscussionsByQuestion(questionId, parentId, userId)

        return data.map(CodingDiscussionMapper.toResponse);
    }

    async toggleDiscussionVotes(userId: string, clerkUserId: string, dto: DiscussionVoteDto) {
        const vote = await this.discussionRepo.findVote(new Types.ObjectId(userId), new Types.ObjectId(dto.discussionId), clerkUserId);
        let count = 1
        if (!vote) {
            await this.discussionRepo.createVote(new Types.ObjectId(userId), new Types.ObjectId(dto.discussionId), clerkUserId);
            await this.discussionRepo.updateVote(new Types.ObjectId(dto.discussionId), 1);
        } else {
            await this.discussionRepo.deleteVote(new Types.ObjectId(userId), new Types.ObjectId(dto.discussionId), clerkUserId);
            await this.discussionRepo.updateVote(new Types.ObjectId(dto.discussionId), -1);
            count = -1
        }
        return { value: count };
    }

    // async getReplies(parentId: string, questionId: string) {
    //     return (await this.discussionRepo.getReplies(new Types.ObjectId(parentId), new Types.ObjectId(questionId))).map(CodingDiscussionMapper.toResponse);
    // }
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
            const accuracy =
                ((aiFeedback.clarityScore ?? 0) + (aiFeedback.correctnessScore ?? 0)) / 2;
            await this.progressService.onCodingAccepted(new Types.ObjectId(userId), accuracy);
            await this.activityService.record({
                userId: new Types.ObjectId(userId),
                clerkUserId,
                eventType: ActivityLogType.CODING_ACCEPTED,
                referenceId: new Types.ObjectId(submissionId),
            });
        }
    }
}