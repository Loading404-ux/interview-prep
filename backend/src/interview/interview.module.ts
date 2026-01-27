import { Module } from '@nestjs/common';
import { InterviewController } from './interview.controller';
import { InterviewService } from './interview.service';
import { GeminiService } from './gemini.util';
import { AiModule } from 'src/ai/ai.module';

@Module({
  imports:[AiModule],
  controllers: [InterviewController],
  providers: [InterviewService,GeminiService]
})
export class InterviewModule {}
