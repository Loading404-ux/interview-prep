import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

import { CodingModule } from './coding/coding.module';
import { DatabaseModule } from './database/database.module';
import { ActivityModule } from './activity/activity.module';
import { HrModule } from './hr/hr.module';
import { UserModule } from './user/user.module';
import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useClass: MongooseConfigService,
    // }),
    DatabaseModule,
    AuthModule,
    UserModule,
    CodingModule,
    ActivityModule,
    HrModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
