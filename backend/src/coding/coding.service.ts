import { Injectable } from '@nestjs/common';
import { CodingSubmissionRepository } from './coding.repository';
import { CreateCodingSubmissionDto } from './coding.dto';
import { Types } from 'mongoose';
import { CodingSubmissionMapper } from './coding.mapper';

@Injectable()
export class CodingService {
    constructor(
        private readonly repo: CodingSubmissionRepository,
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

    // 🔥 This runs async
    private async triggerAiReview(submissionId: string) {
        // LangGraph / Queue / Event goes here
        // DO NOT IMPLEMENT NOW
    }
}
