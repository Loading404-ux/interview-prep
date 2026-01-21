import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class DailyActivity extends Document {

  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, index: true })
  clerkUserId: string;

  // 🔑 ISO date string: "2026-01-22"
  @Prop({ required: true, index: true })
  date: string;

  // ✅ Streak logic
  @Prop({ default: false })
  didCoding: boolean;

  @Prop({ default: false })
  didHr: boolean;

  @Prop({ default: false })
  didAptitude: boolean;

  // 🔥 Contribution heatmap
  @Prop({ default: 0 })
  contributionCount: number;
}

export const DailyActivitySchema =
  SchemaFactory.createForClass(DailyActivity);

// 🔒 One document per user per day
DailyActivitySchema.index(
  { userId: 1, date: 1 },
  { unique: true }
);
