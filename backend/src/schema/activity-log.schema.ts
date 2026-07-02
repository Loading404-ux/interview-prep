import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export const ActivityLogType = {
  CODING_SUBMITTED: 'coding:submitted',
  CODING_ACCEPTED: 'coding:accepted',
  HR_START: 'hr:start',
  HR_COMPLETE: 'hr:complete',
  APTITUDE_START: 'aptitude:start',
  APTITUDE_COMPLETE: 'aptitude:complete',
} as const;

export type ActivityLogType =
  (typeof ActivityLogType)[keyof typeof ActivityLogType];

@Schema({ timestamps: true })
export class ActivityLog extends Document {

  @Prop({ type: Types.ObjectId, ref: User.name, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, index: true, type: String })
  clerkUserId: string

  @Prop({
    type: String,
    enum: Object.values(ActivityLogType),
    required: true,
    index: true,
  })
  eventType: ActivityLogType;

  @Prop()
  referenceId: Types.ObjectId;

  @Prop()
  description: string;

  @Prop({ type: Map, of: String })
  metadata?: Record<string, any>;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);