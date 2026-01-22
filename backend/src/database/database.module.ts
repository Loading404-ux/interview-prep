import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from 'src/config/mongo.config.service';
import { Schemas } from 'src/schema';

// @Module({
//     imports: [
//         MongooseModule.forFeature([
//             { name: Schemas.ActivityLog.name, schema: Schemas.ActivityLogSchema },
//             { name: Schemas.AptitudeQuestion.name, schema: Schemas.AptitudeQuestionSchema },
//             { name: Schemas.AptitudeSession.name, schema: Schemas.AptitudeSessionSchema },
//             { name: Schemas.CodingQuestion.name, schema: Schemas.CodingQuestionSchema },
//             { name: Schemas.CodingDiscussion.name, schema: Schemas.CodingDiscussionSchema },
//             { name: Schemas.CodingSubmission.name, schema: Schemas.CodingSubmissionSchema },
//             { name: Schemas.HrQuestion.name, schema: Schemas.HrQuestionSchema },
//             { name: Schemas.HrSession.name, schema: Schemas.HrSessionSchema },
//             { name: Schemas.UserAchievement.name, schema: Schemas.UserAchievementSchema },
//             { name: Schemas.UserMetrics.name, schema: Schemas.UserMetricsSchema },
//             { name: Schemas.User.name, schema: Schemas.UserSchema },

//             { name: Schemas.DailyActivity.name, schema: Schemas.DailyActivitySchema },

//             { name: Schemas.SubmissionVote.name, schema: Schemas.SubmissionVoteSchema },
//             { name: Schemas.DiscussionVote.name, schema: Schemas.DiscussionVoteSchema },
//         ]),
//     ],
//     exports: [MongooseModule],
// })
// export class DatabaseModule { }

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}

