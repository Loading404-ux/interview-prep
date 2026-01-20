import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class HrQuestion extends Document {

  @Prop({ required: true })
  question: string;

  @Prop()
  preferredAnswer: string;

  @Prop()
  sampleAnswer: string;

  @Prop()
  company?: string;

  @Prop({ enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' })
  difficulty: string;
}

export const HrQuestionSchema = SchemaFactory.createForClass(HrQuestion);