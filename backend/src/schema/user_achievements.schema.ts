import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types,Document } from 'mongoose';
import { User } from './user.schema';


@Schema({ timestamps: true })
export class UserAchievement extends Document {

  @Prop({ type: Types.ObjectId, ref: User.name, index: true })
  userId: Types.ObjectId;
  
  @Prop({ type: String, index: true })
  clerkUserId: string;

  @Prop({ type: String, required: true })
  achievementKey: string;

  @Prop({ type: Date, required: true })
  unlockedAt: Date;
}


export const UserAchievementSchema = SchemaFactory.createForClass(UserAchievement);
