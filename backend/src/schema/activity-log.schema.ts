import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export enum ActivityLogType {
  CODING_SUBMIT = 'CODING_SUBMIT',
  //CODE_DISCUSSION = 'CODE_DISCUSSION',
  HR_SESSION = 'HR_SESSION',
  APTITUDE_SESSION = 'APTITUDE_SESSION',
}

@Schema({ timestamps: true })
export class ActivityLog extends Document {

  @Prop({ type: Types.ObjectId, ref: User.name, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, index: true, type: String })
  clerkUserId: string

  @Prop({
    type: String,
    enum: ActivityLogType,
    required: true,
    index: true,
  })
  eventType: string;

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