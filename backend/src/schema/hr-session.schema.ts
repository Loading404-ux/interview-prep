import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { HrQuestion } from './hr-questions.schema';
import { User } from './user.schema';
@Schema({ _id: false })
export class HrQuestionResponse {

  @Prop({ type: Types.ObjectId, ref: 'HrQuestion', required: true })
  questionId: Types.ObjectId;

  @Prop({ required: true })
  audioUrl: string;

  @Prop()
  transcript?: string;
}

export const HrQuestionResponseSchema =
  SchemaFactory.createForClass(HrQuestionResponse);

@Schema({ _id: false })
export class HrAiEvaluation {

  @Prop({ min: 0, max: 100 })
  clarity?: number;

  @Prop({ min: 0, max: 100 })
  structure?: number;

  @Prop({ min: 0, max: 100 })
  confidence?: number;

  @Prop()
  generatedIdealAnswer?: string;
}

export const HrAiEvaluationSchema =
  SchemaFactory.createForClass(HrAiEvaluation);


@Schema({ timestamps: true })
export class HrSession extends Document {

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
    type: [HrQuestionResponseSchema],
    required: true,
    default: []
  })
  questions: HrQuestionResponse[];

  @Prop({ type: HrAiEvaluationSchema })
  aiEvaluation?: HrAiEvaluation;
}


export const HrSessionSchema = SchemaFactory.createForClass(HrSession);