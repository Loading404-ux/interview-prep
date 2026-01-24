import { Controller, Post, Body, UseInterceptors, UploadedFile, Req, UseGuards } from '@nestjs/common';
import { HrService } from './hr.service';
import {
  CompleteSessionDto,
  SubmitHrAnswerDto,
} from './hr.dto';
import { FileInterceptor } from "@nestjs/platform-express"
import { ClerkAuthGuard } from 'src/common/guard/clerk-auth.guard';

@Controller('hr')
@UseGuards(ClerkAuthGuard)
export class HrController {
  constructor(private readonly hrService: HrService) { }

  @Post('session/start')
  startSession(@Req() req) {

    return this.hrService.startSession({ userId: req.user._id, clerkUserId: req.user.clerkUserId });
  }

  @Post('answer/submit')
  @UseInterceptors(FileInterceptor('audio'))
  submitAnswer(
    @UploadedFile() audio: Express.Multer.File,
    @Body() dto: SubmitHrAnswerDto,
  ) {
    return this.hrService.submitAnswer({
      sessionId: dto.sessionId,
      questionId: dto.questionId,
      audioFile: audio,
      transcript: dto.transcript, // optional fallback
    });
  }
  @Post('session/complete')
  completeSession(@Body() dto: CompleteSessionDto) {
    return this.hrService.completeSession(dto);
  }
}
