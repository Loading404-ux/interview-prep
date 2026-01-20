import { Module } from '@nestjs/common';
import { CodingController } from './coding.controller';
import { CodingService } from './coding.service';
import { CodingRepository } from './coding.repository';
import { DatabaseModule } from 'src/database/database.module';
import { ClerkProvider } from 'src/common/providers/clerk.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [CodingController],
  providers: [CodingService, CodingRepository, ClerkProvider]
})
export class CodingModule { }
