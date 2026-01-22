import { Types, Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from "./user.schema";
import { CodingSubmission } from "./coding-submission.schema";

@Schema({ timestamps: true })
export class SubmissionVote extends Document {

    @Prop({ type: Types.ObjectId, ref: CodingSubmission.name, required: true, index: true })
    submissionId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
    userId: Types.ObjectId;

    @Prop({ required: true, index: true, type: String })
    clerkUserId: string

}

export const SubmissionVoteSchema =
    SchemaFactory.createForClass(SubmissionVote);

SubmissionVoteSchema.index(
    { submissionId: 1, userId: 1 },
    { unique: true }
);
