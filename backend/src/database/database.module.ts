import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Schemas } from 'src/schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Schemas.ActivityLog.name, schema: Schemas.ActivityLogSchema },
            { name: Schemas.AptitudeQuestion.name, schema: Schemas.AptitudeQuestionSchema },
            { name: Schemas.AptitudeSession.name, schema: Schemas.AptitudeSessionSchema },
            { name: Schemas.CodingQuestion.name, schema: Schemas.CodingQuestionSchema },
            { name: Schemas.CodingDiscussion.name, schema: Schemas.CodingDiscussionSchema },
            { name: Schemas.CodingSubmission.name, schema: Schemas.CodingSubmissionSchema },
            { name: Schemas.HrQuestion.name, schema: Schemas.HrQuestionSchema },
            { name: Schemas.HrSession.name, schema: Schemas.HrSessionSchema },
            { name: Schemas.UserAchievement.name, schema: Schemas.UserAchievementSchema },
            { name: Schemas.UserMetrics.name, schema: Schemas.UserMetricsSchema },
            { name: Schemas.User.name, schema: Schemas.UserSchema },
        ]),
    ],
    exports: [MongooseModule],
})
export class DatabaseModule { }
