import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "./user.schema";
import { Types ,Document} from "mongoose";

@Schema({ timestamps: true })
export class AptitudeSession extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  clerkUserId: string;

  @Prop({ enum: ['RAPID', 'STANDARD'], required: true })
  mode: string;

  @Prop({ default: 0 })
  totalQuestions: number;

  @Prop({ default: 0 })
  correctCount: number;

  @Prop({ default: 0 })
  wrongCount: number;

  @Prop({ default: 0 })
  timeTakenSeconds: number;

  @Prop({
    enum: ['STARTED', 'COMPLETED'],
    default: 'STARTED',
  })
  status: string;
}

export const AptitudeSessionSchema =
  SchemaFactory.createForClass(AptitudeSession);
