import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema({ timestamps: true })
export class AptitudeQuestion extends Document {

  @Prop({ required: true })
  text: string;

  @Prop({ type: [String], required: true })
  options: string[];

  @Prop({ required: true })
  correctAnswerIndex: number;

  @Prop()
  explanation: string;

  @Prop()
  company?: string;

  @Prop({ enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' })
  difficulty: string;
}


export const AptitudeQuestionSchema = SchemaFactory.createForClass(AptitudeQuestion);