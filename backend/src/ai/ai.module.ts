import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { ConfigModule } from '@nestjs/config';
import { LlmFactory } from './llm.factory';
import { AssemblyAiService } from './assemblyai.service';

@Module({
  imports: [ConfigModule],
  providers: [
    LlmFactory,
    AssemblyAiService,
    AiService
  ],
  exports: [
    LlmFactory,
    AssemblyAiService,
    AiService
  ],
  
})
export class AiModule { }
