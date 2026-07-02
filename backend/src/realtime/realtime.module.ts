import { Global, Module } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';
import { RealtimeService } from './realtime.service';
import { SseController } from './sse.controller';
import { SseService } from './sse.service';

@Global()
@Module({
  controllers: [SseController],
  providers: [RealtimeGateway, RealtimeService, SseService],
  exports: [RealtimeService, SseService],
})
export class RealtimeModule { }
