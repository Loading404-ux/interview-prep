import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AptitudeService } from './aptitude.service';
import {
  StartAptitudeSessionDto,
  SubmitAptitudeAnswerDto,
} from './aptitude.dto';
import { ClerkAuthGuard } from 'src/common/guard/clerk-auth.guard';

@Controller('aptitude')
@UseGuards(ClerkAuthGuard)
export class AptitudeController {
  constructor(private readonly service: AptitudeService) {}

  @Post('session/start')
  start(@Req() req: any, @Body() dto: StartAptitudeSessionDto) {
    return this.service.startSession({
      userId: req.user.id,
      clerkUserId: req.user.clerkUserId,
      mode: dto.mode,
    });
  }

  @Post('answer/submit')
  submit(@Req() req: any, @Body() dto: SubmitAptitudeAnswerDto) {
    return this.service.submitAnswer({
      userId: req.user.id,
      clerkUserId: req.user.clerkUserId,
      ...dto,
    });
  }
}
