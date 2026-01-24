import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Schemas } from 'src/schema';
import { UserRepository } from './user.repository';
import { UserProgressService } from './user-progress.service';
import { ActivityModule } from 'src/activity/activity.module';

@Module({
  imports: [
    forwardRef(() => ActivityModule), // 🔴 REQUIRED
    MongooseModule.forFeature([
      { name: Schemas.User.name, schema: Schemas.UserSchema },
      { name: Schemas.UserMetrics.name, schema: Schemas.UserMetricsSchema },
      { name: Schemas.UserAchievement.name, schema: Schemas.UserAchievementSchema },
    ]),
  ],
  providers: [UserService, UserRepository, UserProgressService],
  exports: [UserRepository, UserProgressService],
  controllers: [UserController],
})
export class UserModule { }