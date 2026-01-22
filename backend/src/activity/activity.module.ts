import { Module } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { ClerkProvider } from 'src/common/providers/clerk.provider';
import { MongooseModule } from '@nestjs/mongoose';
import { Schemas } from 'src/schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Schemas.ActivityLog.name, schema: Schemas.ActivityLogSchema },
      { name: Schemas.DailyActivity.name, schema: Schemas.DailyActivitySchema },
    ]),
  ],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule { }
