import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum AptitudeQuestionType {
  SHORT = 'SHORT',
  LONG = 'LONG',
}

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

  @Prop({ enum: AptitudeQuestionType, default: AptitudeQuestionType.SHORT })
  type?: AptitudeQuestionType;

  @Prop({ type: [String], index: true })
  tags?: string[]; //Percentage, number system, work and time , permutation and combination , arithmetic process, calendar, Direction sense , introduced to verbal reasoning, advice and exceptions , profit and loss , HCF and LCM, Pipes and cisterns, Probability , geometric progression , clock, blood relation , sentence ordering, simple interest, average, speed and distance and time, arrangements, sentence improvement, ratio and proportion , Boths streams , series, Allegations and mixtures
}


export const AptitudeQuestionSchema = SchemaFactory.createForClass(AptitudeQuestion);