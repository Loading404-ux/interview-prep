import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema({ timestamps: true })
export class User extends Document {

  @Prop({ type: String, required: true, unique: true, index: true })
  clerkUserId: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, index: true })
  email: string;

  @Prop()
  university?: string;

  @Prop()
  profilePic?: string;

  @Prop({ type: [String], default: [] })
  targetCompanies: string[];

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}


export const UserSchema = SchemaFactory.createForClass(User);