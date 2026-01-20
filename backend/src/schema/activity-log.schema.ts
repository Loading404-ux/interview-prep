import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,Types } from 'mongoose';
import { User } from './user.schema';


@Schema({ timestamps: true })
export class ActivityLog extends Document {

  @Prop({ type: Types.ObjectId, ref: User.name, index: true })
  userId: Types.ObjectId;

  @Prop({ enum: ['coding', 'hr', 'aptitude'], index: true })
  type: string;

  @Prop()
  referenceId: Types.ObjectId;

  @Prop()
  description: string;
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);