import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClerkProvider } from 'src/common/providers/clerk.provider';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ClerkProvider],
})
export class AuthModule { }
