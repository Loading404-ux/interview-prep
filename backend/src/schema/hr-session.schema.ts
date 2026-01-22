import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { HrQuestion } from './hr-questions.schema';
import { User } from './user.schema';

@Schema({ _id: false })
class AiResult {
  @Prop({ min: 0, max: 100, type: Number, default: 0 })
  clarity: number;

  @Prop({ min: 0, max: 100, type: Number, default: 0 })
  structure: number;

  @Prop({ min: 0, max: 100, type: Number, default: 0 })
  confidence: number;

  @Prop({ type: [String], default: [] })
  improvementTips: string[];

  @Prop({ type: String, default: '' })
  generatedPreferredAnswer: string;
}

@Schema({ _id: false })
export class HrQuestionResponse {
  @Prop({ type: Types.ObjectId, ref: 'HrQuestion', required: true })
  questionId: Types.ObjectId;

  @Prop()
  transcript?: string;

  @Prop({ default: 1 })
  attempt: number;

  @Prop()
  durationSeconds?: number;

  @Prop({ type: AiResult, required: true })
  aiResult: AiResult;
}


export const HrQuestionResponseSchema =
  SchemaFactory.createForClass(HrQuestionResponse);

@Schema({ _id: false })
export class HrAiEvaluation {
  @Prop({ min: 0, max: 100 })
  avgClarity?: number;

  @Prop({ min: 0, max: 100 })
  avgStructure?: number;

  @Prop({ min: 0, max: 100 })
  avgConfidence?: number;

  @Prop()
  overallFeedback?: string;

  @Prop({ default: 'v1' })
  evaluationVersion: string;
}

export const HrAiEvaluationSchema =
  SchemaFactory.createForClass(HrAiEvaluation);


@Schema({ timestamps: true })
export class HrSession extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
    index: true,
  })
  userId: Types.ObjectId;

  @Prop({ required: true, index: true })
  clerkUserId: string;

  @Prop({
    type: [HrQuestionResponseSchema],
    default: [],
  })
  questions: HrQuestionResponse[];

  @Prop({ type: HrAiEvaluationSchema })
  aiEvaluation?: HrAiEvaluation;

  @Prop({
    enum: ['STARTED', 'COMPLETED', 'AI_PENDING', 'AI_DONE', 'AI_FAILED'],
    default: 'STARTED',
    index: true,
  })
  status: string;

  @Prop()
  completedAt?: Date;
}



export const HrSessionSchema = SchemaFactory.createForClass(HrSession);