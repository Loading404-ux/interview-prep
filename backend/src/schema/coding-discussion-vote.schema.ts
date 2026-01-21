import { Types, Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from "./user.schema";
import { CodingDiscussion } from "./coding-discussion.schema";

@Schema({ timestamps: true })
export class DiscussionVote extends Document {

  @Prop({ type: Types.ObjectId, ref: CodingDiscussion.name, required: true })
  discussionId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  clerkUserId: string;
}

export const DiscussionVoteSchema =
  SchemaFactory.createForClass(DiscussionVote);

DiscussionVoteSchema.index(
  { discussionId: 1, userId: 1 },
  { unique: true }
);