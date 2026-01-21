import { Module } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { ClerkProvider } from 'src/common/providers/clerk.provider';

@Module({
  controllers: [ActivityController],
  providers: [ActivityService,ClerkProvider],
})
export class ActivityModule {}
