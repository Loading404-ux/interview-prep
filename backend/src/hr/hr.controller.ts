import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { HrService } from './hr.service';
import {
  CompleteSessionDto,
  StartHrSessionDto,
  SubmitHrAnswerDto,
} from './hr.dto';
import { FileInterceptor } from "@nestjs/platform-express"

@Controller('hr')
export class HrController {
  constructor(private readonly hrService: HrService) { }

  @Post('session/start')
  startSession(@Body() dto: StartHrSessionDto) {
    return this.hrService.startSession(dto);
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
