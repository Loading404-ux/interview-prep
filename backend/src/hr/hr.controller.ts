import { Controller, Post, Body, UseInterceptors, UploadedFile, Req, UseGuards } from '@nestjs/common';
import { HrService } from './hr.service';
import {
  CompleteSessionDto,
  SubmitHrAnswerDto,
} from './hr.dto';
import { FileInterceptor } from "@nestjs/platform-express"
import { ClerkAuthGuard } from 'src/common/guard/clerk-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('hr')
@UseGuards(ClerkAuthGuard)
export class HrController {
  constructor(private readonly hrService: HrService) { }

  @Post('session/start')
  startSession(@Req() req: any) {

    return this.hrService.startSession({ userId: req.user.id, clerkUserId: req.user.clerkUserId });
  }

  @Post('answer/submit')
  @UseInterceptors(FileInterceptor('audio', {
    storage: diskStorage({
      destination: "./uploads/audios",
      filename: (_, file, cb) => {
        const unique =
          Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${unique}${extname(file.originalname)}`);
      },
    }),
  }))
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
    //HrAiEvaluation
    return this.hrService.completeSession(dto);
  }
}
