import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class HrQuestion extends Document {

  @Prop({ required: true })
  question: string;

  @Prop()
  preferred_answer: string;

  @Prop()
  sample_answer: string;

  @Prop({type:String,default:null})
  company?: string;

  // @Prop({ enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' })
  // difficulty: string;
}

export const HrQuestionSchema = SchemaFactory.createForClass(HrQuestion);