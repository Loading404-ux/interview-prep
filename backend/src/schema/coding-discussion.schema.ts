import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CodingQuestion } from './coding-questions.schema';
import { User } from './user.schema';
@Schema({ timestamps: true })
export class CodingDiscussion extends Document {

  @Prop({ type: Types.ObjectId, ref: CodingQuestion.name, index: true })
  questionId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, index: true, type: String })
  clerkUserId: string
  @Prop({ type: Types.ObjectId, ref: CodingDiscussion.name, default: null })
  parentId: Types.ObjectId | null;

  @Prop({ required: true })
  content: string;

  @Prop({ default: 0 })
  upvotes: number;

  @Prop({ default: 0 })
  replyCount: number;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const CodingDiscussionSchema = SchemaFactory.createForClass(CodingDiscussion);
CodingDiscussionSchema.index({ questionId: 1, createdAt: -1 });
CodingDiscussionSchema.index({ parentId: 1 });