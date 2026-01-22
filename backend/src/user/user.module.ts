import {  Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from 'src/database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Schemas } from 'src/schema';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Schemas.User.name, schema: Schemas.UserSchema },
      { name: Schemas.UserMetrics.name, schema: Schemas.UserMetricsSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService,UserRepository],
  exports:[UserRepository]
})
export class UserModule { }
