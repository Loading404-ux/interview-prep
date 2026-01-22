import { Controller, Post, Body } from '@nestjs/common';
import { HrService } from './hr.service';
import {
  CompleteSessionDto,
  StartHrSessionDto,
  SubmitHrAnswerDto,
} from './hr.dto';

@Controller('hr')
export class HrController {
  constructor(private readonly hrService: HrService) { }

  @Post('session/start')
  startSession(@Body() dto: StartHrSessionDto) {
    return this.hrService.startSession(dto);
  }

  @Post('answer/submit')
  submitAnswer(@Body() dto: SubmitHrAnswerDto) {
    return this.hrService.submitAnswer(dto);
  }
  @Post('session/complete')
  completeSession(@Body() dto: CompleteSessionDto) {
    return this.hrService.completeSession(dto);
  }
}
