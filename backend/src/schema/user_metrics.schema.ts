import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

@Schema({ _id: false })
export class CodingMetrics {
  @Prop({ default: 0, min: 0, max: 100 })
  accuracy: number;

  @Prop({ default: 0, min: 0 })
  totalSubmissions: number;

  @Prop({ default: 0, min: 0 })
  acceptedSubmissions: number;
}

const CodingMetricsSchema = SchemaFactory.createForClass(CodingMetrics);

@Schema({ _id: false })
export class HrMetrics {

  @Prop({ default: 0, min: 0, max: 100 })
  avgConfidence: number;

  @Prop({ default: 0, min: 0 })
  totalSessions: number;
}

@Schema({ _id: false })
export class AptitudeMetrics {

  @Prop({ default: 0, min: 0, max: 100 })
  accuracy: number;

  @Prop({ default: 0, min: 0 })
  totalAttempts: number;
}

@Schema({ _id: false })
export class StreakMetrics {

  @Prop({ default: 0, min: 0 })
  current: number;

  @Prop({ default: 0, min: 0 })
  longest: number;

  @Prop()
  lastActiveDate?: Date;
}

const StreakMetricsSchema = SchemaFactory.createForClass(StreakMetrics);

const AptitudeMetricsSchema = SchemaFactory.createForClass(AptitudeMetrics);


const HrMetricsSchema = SchemaFactory.createForClass(HrMetrics);


@Schema({ timestamps: true })
export class UserMetrics extends Document {

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
    unique: true,
    index: true
  })
  userId: Types.ObjectId;

  @Prop({ type: CodingMetricsSchema, default: {} })
  coding: CodingMetrics;

  @Prop({ type: HrMetricsSchema, default: {} })
  hr: HrMetrics;

  @Prop({ type: AptitudeMetricsSchema, default: {} })
  aptitude: AptitudeMetrics;

  @Prop({ type: StreakMetricsSchema, default: {} })
  streak: StreakMetrics;
}



export const UserMetricsSchema = SchemaFactory.createForClass(UserMetrics);