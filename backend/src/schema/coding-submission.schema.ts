import { Types, Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from "./user.schema";
import { CodingQuestion } from "./coding-questions.schema";

@Schema({ _id: false })
export class AiFeedback {

  @Prop({ min: 0, max: 100 })
  clarityScore?: number;

  @Prop({ min: 0, max: 100 })
  correctnessScore?: number;

  @Prop()
  suggestions?: string;
}

export const AiFeedbackSchema = SchemaFactory.createForClass(AiFeedback);

export enum ReviewSource {
  AI = 'ai',
  HUMAN = 'human',
}

export enum SubmissionVerdict {
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  NEEDS_IMPROVEMENT = 'needs_improvement',
}

export type CodingSubmissionDocument = CodingSubmission & Document

@Schema({ timestamps: true })
export class CodingSubmission extends Document {

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
    index: true
  })
  userId: Types.ObjectId;
  
  @Prop({ required: true, index: true, type: String })
  clerkUserId: string;

  @Prop({
    type: Types.ObjectId,
    ref: CodingQuestion.name,
    required: true,
    index: true
  })
  questionId: Types.ObjectId;

  @Prop({ required: true })
  solutionText: string;

  @Prop()
  explanation?: string;

  @Prop({
    enum: ReviewSource,
    default: ReviewSource.AI,
    required: true
  })
  reviewedBy: ReviewSource;

  @Prop({
    enum: SubmissionVerdict,
    required: true,
    index: true
  })
  verdict: SubmissionVerdict;

  @Prop({ type: AiFeedbackSchema })
  aiFeedback?: AiFeedback;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date
}

export const CodingSubmissionSchema = SchemaFactory.createForClass(CodingSubmission);


