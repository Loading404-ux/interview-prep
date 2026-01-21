import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ClerkProvider } from './common/providers/clerk.provider';
import { MongooseConfigService } from './config/mongo.config.service';
import { ConfigModule } from '@nestjs/config';
import { Schemas } from "./schema"
import { CodingModule } from './coding/coding.module';
import { DatabaseModule } from './database/database.module';
import { ActivityModule } from './activity/activity.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongooseConfigService,
    }),
  
    CodingModule,
    DatabaseModule,
    ActivityModule,
  ],
  controllers: [AppController],
  providers: [AppService, ClerkProvider, MongooseConfigService],
})
export class AppModule { }
