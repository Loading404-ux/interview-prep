import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ClerkProvider } from './common/providers/clerk.provider';
import { MongooseConfigService } from './config/mongo.config.service';
import { ConfigModule } from '@nestjs/config';
import { Schemas } from "./schema"
import { CodingModule } from './coding/coding.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongooseConfigService,
    }),
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
    CodingModule,
  ],
  controllers: [AppController],
  providers: [AppService, ClerkProvider, MongooseConfigService],
})
export class AppModule { }
