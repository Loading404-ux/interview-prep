import { Module } from '@nestjs/common';
import { HrController } from './hr.controller';
import { HrService } from './hr.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Schemas } from 'src/schema';
import { AiModule } from 'src/ai/ai.module';
import { HrQuestionRepository, HrSessionRepository } from './hr.repository';
import { AiService } from 'src/ai/ai.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Schemas.HrQuestion.name, schema: Schemas.HrQuestionSchema },
      { name: Schemas.HrSession.name, schema: Schemas.HrSessionSchema },
    ]),
    AiModule,
  ],
  controllers: [HrController],
  providers: [HrService,HrSessionRepository,HrQuestionRepository,AiService]
})
export class HrModule { }
