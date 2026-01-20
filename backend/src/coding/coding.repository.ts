import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CodingSubmission, SubmissionVerdict } from '../schema/coding-submission.schema';
import { Injectable } from '@nestjs/common';
// import { SubmissionVerdict } from '../schemas/enums';

@Injectable()
export class CodingRepository {
    private data: Partial<CodingSubmission>[] = [];
    constructor(
        @InjectModel(CodingSubmission.name)
        private readonly model: Model<CodingSubmission>
    ) { }

    async createInitialSubmission(data: Partial<CodingSubmission>): Promise<CodingSubmission> {
        return this.model.create({
            ...data,
            verdict: SubmissionVerdict.NEEDS_IMPROVEMENT,
        });
        // return await this.data.push({
        //     _id: data._id,
        //     ...data,
        //     verdict: SubmissionVerdict.NEEDS_IMPROVEMENT
        // });
    }

    async updateAiReview(
        submissionId: string,
        verdict: SubmissionVerdict,
        aiFeedback: any
    ) {
        return this.model.findByIdAndUpdate(
            submissionId,
            { verdict, aiFeedback },
            { new: true }
        );
    }

    async findByUser(userId: string) {
        return this.model
            .find({ userId })
            .sort({ createdAt: -1 });
    }
}
