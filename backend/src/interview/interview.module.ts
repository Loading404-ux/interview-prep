import { Module } from '@nestjs/common';
import { InterviewController } from './interview.controller';
import { InterviewService } from './interview.service';
import { GeminiService } from './gemini.util';

@Module({
  controllers: [InterviewController],
  providers: [InterviewService,GeminiService]
})
export class InterviewModule {}
