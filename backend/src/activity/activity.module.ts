import { forwardRef, Module } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Schemas } from 'src/schema';
import { ActivityRepository } from './activity.repository';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    MongooseModule.forFeature([
      { name: Schemas.ActivityLog.name, schema: Schemas.ActivityLogSchema },
      { name: Schemas.DailyActivity.name, schema: Schemas.DailyActivitySchema },
      { name: Schemas.UserMetrics.name, schema: Schemas.UserMetricsSchema },
    ]),
  ],
  controllers: [ActivityController],
  providers: [ActivityService, ActivityRepository],
  exports: [ActivityService], // 🔴 REQUIRED
})
export class ActivityModule { }

