import { Module } from '@nestjs/common';
import { CodingController } from './coding.controller';
import { CodingService } from './coding.service';
import { CodingRepository } from './coding.repository';
import { DatabaseModule } from 'src/database/database.module';
import { ClerkProvider } from 'src/common/providers/clerk.provider';
import { Schemas } from 'src/schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AiModule } from 'src/ai/ai.module';
import { ActivityModule } from 'src/activity/activity.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Schemas.CodingQuestion.name, schema: Schemas.CodingQuestionSchema },
      { name: Schemas.CodingSubmission.name, schema: Schemas.CodingSubmissionSchema },
      { name: Schemas.CodingDiscussion.name, schema: Schemas.CodingDiscussionSchema },

      { name: Schemas.SubmissionVote.name, schema: Schemas.SubmissionVoteSchema },
      { name: Schemas.DiscussionVote.name, schema: Schemas.DiscussionVoteSchema },
    ]),
    AiModule,
    UserModule,
    ActivityModule
  ],
  controllers: [CodingController],
  providers: [CodingService, CodingRepository]
})
export class CodingModule { }
