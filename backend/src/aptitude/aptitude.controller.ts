import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AptitudeService } from './aptitude.service';
import {
  CompleteAptitudeSessionDto,
  StartAptitudeSessionDto,
  SubmitAptitudeAnswerDto,
} from './aptitude.dto';
import { ClerkAuthGuard } from 'src/common/guard/clerk-auth.guard';

@Controller('aptitude')
@UseGuards(ClerkAuthGuard)
export class AptitudeController {
  constructor(private readonly service: AptitudeService) { }

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
    console.log(dto)
    return this.service.submitAnswer({
      userId: req.user.id,
      clerkUserId: req.user.clerkUserId,
      ...dto,
    });
  }
  @Post('session/complete')
  complete(@Req() req: any, @Body() dto: CompleteAptitudeSessionDto) {
    return this.service.completeSession({
      userId: req.user.id,
      clerkUserId: req.user.clerkUserId,
      sessionId: dto.sessionId,
    });
  }

}
