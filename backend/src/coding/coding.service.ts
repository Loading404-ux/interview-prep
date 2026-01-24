import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CodingRepository } from './coding.repository';
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

@Injectable()
export class CodingService {
    constructor(
        private readonly repo: CodingRepository,
        private readonly activityService: ActivityService,
        private readonly aiService: AiService,
        private readonly progressService: UserProgressService,

    ) { }
    async getQuestions() {
        return await this.repo.getQuestions();
    }
    async getQuestion(id: string) {
        return await this.repo.getQuestionById(id);
    }
    async submitSolution(user: any, dto: CodingSubmissionDto) {
        const submission = await this.repo.createSubmission({
            userId: user._id,
            clerkUserId: user.clerkUserId,
            questionId: new Types.ObjectId(dto.questionId),
            solution: dto.solutionText,
            explanation: dto.explanation,
        });

        await this.activityService.record({
            userId: new Types.ObjectId(user._id),
            clerkUserId: user.clerkUserId,
            eventType: 'CODING_SUBMIT',
            referenceId: submission._id,
        });

        void this.triggerAiReview(submission._id.toString(), user);

        return CodingSubmissionMapper.toResponse(submission);
    }

    async toggleSubmissionVote(user: any, dto: SubmisstionVoteDto) {
        const submission = await this.repo.findSubmissionById(dto.submissionId);
        if (!submission) throw new NotFoundException('Submission not found');

        if (submission.verdict !== SubmissionVerdict.ACCEPTED) {
            throw new ForbiddenException('Only accepted solutions can be upvoted');
        }

        const vote = await this.repo.findSubmissionVote(
            user._id,
            dto.submissionId,
        );

        if (vote) {
            await this.repo.deleteSubmissionVote(vote._id);
            await this.repo.incrementSubmissionUpvotes(submission._id, -1);
            return { voted: false };
        }

        await this.repo.createSubmissionVote(
            user._id,
            dto.submissionId,
            user.clerkUserId,
        );
        await this.repo.incrementSubmissionUpvotes(submission._id, 1);
        return { voted: true };
    }

    async createDiscussion(user: any, dto: CodingDiscussionDto) {
        let parent: CodingDiscussion | null = null;
        console.log(parent)
        const data = {
            userId: user._id,
            clerkUserId: user.clerkUserId,
            questionId: new Types.ObjectId(dto.questionId),

            content: dto.content,
        }
        if (dto.parentId) {
            parent = await this.repo.findDiscussionById(dto.parentId);
            if (!parent || parent.parentId) {
                throw new BadRequestException('Invalid parent discussion');
            }
            data['parentId'] = parent._id
        }

        const discussion = await this.repo.createDiscussion(data);

        if (parent) {
            await this.repo.incrementReplyCount(parent._id);
        }

        return CodingDiscussionMapper.toResponse(discussion);
    }

    async toggleDiscussionVote(user: any, dto: DiscussionVoteDto) {
        const discussion = await this.repo.findDiscussionById(dto.discussionId);
        if (!discussion) throw new NotFoundException('Discussion not found');

        const vote = await this.repo.findDiscussionVote(
            user._id,
            dto.discussionId,
        );

        if (vote) {
            await this.repo.deleteDiscussionVote(vote._id);
            await this.repo.incrementDiscussionUpvotes(discussion._id, -1);
            return { voted: false };
        }

        await this.repo.createDiscussionVote(
            user._id,
            dto.discussionId,
            user.clerkUserId,
        );
        await this.repo.incrementDiscussionUpvotes(discussion._id, 1);
        return { voted: true };
    }

    async getAcceptedSubmissions(questionId: string) {
        return this.repo.getAcceptedSubmissions(questionId);
    }

    async getDiscussions(questionId: string) {
        console.log("kiiii")
        const data = await this.repo.getDiscussionsByQuestion(questionId);
        return data ?? [];
    }

    async getReplies(discussionId: string) {
        return this.repo.getReplies(discussionId);
    }

    private async triggerAiReview(submissionId: string, user: any) {
        const submission = await this.repo.findSubmissionWithQuestion(submissionId);
        if (!submission) return;

        const review = await this.aiService.aiCodeReview({
            title: submission.questionId.title,
            problem: submission.questionId.problem,
            constraints: submission.questionId.constraints,
            examples: submission.questionId.examples,
            topics: submission.questionId.topics,
            solution: submission.solution,
            explanation: submission.explanation,
        });

        const updated = await this.repo.updateAiReview(
            submission._id,
            review.verdict,
            review.aiFeedback,
        );

        if (updated?.verdict === SubmissionVerdict.ACCEPTED) {
            await this.activityService.record({
                userId: user._id,
                clerkUserId: user.clerkUserId,
                eventType: 'CODING_APPROVED',
                referenceId: updated._id,
            });
            await this.progressService.onCodingAccepted({
                userId: user._id,
                clerkUserId: user.clerkUserId,
            });
        }
    }
}
