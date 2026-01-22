import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CodingRepository } from './coding.repository';
import { CodingDiscussionDto, CreateCodingSubmissionDto } from './coding.dto';
import { Types } from 'mongoose';
import { CodingSubmissionMapper } from './coding.mapper';
import { SubmissionVerdict } from 'src/schema/coding-submission.schema';
import { CodingDiscussion } from 'src/schema/coding-discussion.schema';

//BUG: use clearUserId not mongoId(currently configured with userId not clerkUserId😭)

@Injectable()
export class CodingService {
    constructor(
        private readonly repo: CodingRepository,
        // private readonly activityLogService: ActivityLogService
    ) { }




    async submitSolution(
        userId: string,
        dto: CreateCodingSubmissionDto
    ) {
        // 1️⃣ Create submission
        const submission = await this.repo.createInitialSubmission({
            userId: new Types.ObjectId(userId),
            questionId: new Types.ObjectId(dto.questionId),
            solutionText: dto.solutionText,
            explanation: dto.explanation,
        });

        // 2️⃣ Trigger async AI evaluation (DO NOT BLOCK)
        this.triggerAiReview(submission._id.toString());

        // 3️⃣ Log activity
        // await this.activityLogService.logCoding(
        //     userId,
        //     submission._id,
        //     'Submitted coding solution'
        // );

        return CodingSubmissionMapper.toResponse(submission);
    }

    async toggleSubmissionVote(
        data: { submissionId: string; userId: string }
    ): Promise<{ voted: boolean }> {

        const vote = await this.repo.findSubmissionVote(
            data.userId,
            data.submissionId,
        );
        if (vote) {
            // 👎 Unvote
            await this.repo.updateSubmissionVoteCount({ submissionId: new Types.ObjectId(data.submissionId), userId: data.userId, value: -1 });
            //TODO: delete vote
            return { voted: false };
        }

        // 👍 Vote
        await this.repo.newSubmissionVote(data.userId, data.submissionId);

        const submission = await this.repo.findBySubmissionId(data.submissionId);

        if (submission?.verdict !== SubmissionVerdict.ACCEPTED) {
            throw new ForbiddenException('Only accepted solutions can be upvoted');
        }

        await this.repo.updateSubmissionVoteCount({ submissionId: submission._id, userId: data.userId, value: 1 });
        return { voted: true };
    }



    async createDiscussion(data: CodingDiscussionDto): Promise<CodingDiscussion> {

        let parent: CodingDiscussion | null = null;

        // 1️⃣ Validate parent (if reply)
        if (data.parentId) {
            parent = await this.repo.findByDiscussionId(data.parentId);

            if (!parent || parent.isDeleted) {
                throw new NotFoundException('Parent comment not found');
            }

            // ❌ No replies to replies
            if (parent.parentId) {
                throw new BadRequestException(
                    'Replies to replies are not allowed',
                );
            }
        }

        // 2️⃣ Create discussion
        const discussion = await this.repo.createDiscussion(data);

        // 3️⃣ Update reply count (cached)
        if (parent) {
            await this.repo.incrementDiscussionReplyCount(parent._id);
        }

        return discussion;
    }

    async toggleDiscussionVote(
        data: { discussionId: string; userId: string }
    ): Promise<{ voted: boolean }> {

        const vote = await this.repo.findDiscussionVote(
            data.userId,
            data.discussionId,
        );
        if (vote) {
            // 👎 Unvote
            await this.repo.updateDiscussionVoteCount({ userId: data.userId, discussionId: new Types.ObjectId(data.discussionId), value: -1 });
            //TODO: delete vote
            return { voted: false };
        }

        // 👍 Vote
        await this.repo.newDiscussionVote(data.userId, data.discussionId);

        const discussion = await this.repo.findByDiscussionId(data.discussionId);

        if (!discussion) {
            throw new NotFoundException('Discussion not found');
        }

        await this.repo.updateDiscussionVoteCount({
            userId: data.userId,
            discussionId: discussion._id,
            value: 1
        });
        return { voted: true };
    }

    async getDiscussionsByQuestionId(questionId: string) {
        return await this.repo.findByDiscussionsByQuestionId(questionId);
    }

    async getRepliesByDiscussionId(parentId: string) {
        return await this.repo.findDiscussionReplies(new Types.ObjectId(parentId));
    }

    private async triggerAiReview(submissionId: string) {
        // LangGraph / Queue / Event goes here
        // DO NOT IMPLEMENT NOW
    }
}