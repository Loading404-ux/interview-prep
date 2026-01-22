import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AptitudeQuestion } from './aptitude-question.schema';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class AptitudeSession extends Document {

    @Prop({ type: Types.ObjectId, ref: User.name, index: true })
    userId: Types.ObjectId;

    @Prop({ required: true, index: true, type: String })
    clerkUserId: string

    @Prop({ enum: ['rapid', 'standard'], required: true })
    mode: string;

    @Prop([{
        questionId: { type: Types.ObjectId, ref: AptitudeQuestion.name },
        selectedOption: Number,
        isCorrect: Boolean
    }])
    responses: {
        questionId: Types.ObjectId;
        selectedOption: number;
        isCorrect: boolean;
    }[];

    @Prop({ type: Number, default: 0 })
    score: number;

    @Prop({ type: Number, default: 0 })
    accuracy: number;
}

export const AptitudeSessionSchema = SchemaFactory.createForClass(AptitudeSession);