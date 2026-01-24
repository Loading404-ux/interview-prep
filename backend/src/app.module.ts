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
import { AptitudeModule } from './aptitude/aptitude.module';
import { InterviewModule } from './interview/interview.module';
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "uploads"),
      serveRoot: "/uploads",
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
    AptitudeModule,
    InterviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
