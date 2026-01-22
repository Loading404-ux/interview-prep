import { Module } from '@nestjs/common';
import { AptitudeController } from './aptitude.controller';
import { AptitudeService } from './aptitude.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AptitudeRepository } from './aptitude.repository';
import { AptitudeQuestion, AptitudeQuestionSchema } from 'src/schema/aptitude-question.schema';
import { AptitudeSession, AptitudeSessionSchema } from 'src/schema/aptitude-session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AptitudeQuestion.name, schema: AptitudeQuestionSchema },
      { name: AptitudeSession.name, schema: AptitudeSessionSchema },
    ]),
  ],
  controllers: [AptitudeController],
  providers: [AptitudeService, AptitudeRepository],
})
export class AptitudeModule {}

