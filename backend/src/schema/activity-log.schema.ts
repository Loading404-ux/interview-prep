import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';


@Schema({ timestamps: true })
export class ActivityLog extends Document {

  @Prop({ type: Types.ObjectId, ref: User.name, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, index: true, type: String })
  clerkUserId: string

  @Prop({
    type: String,
    enum: ['CODING_SUBMIT', 'HR_SESSION_COMPLETE', 'APTITUDE_ATTEMPT'],
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