import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClerkAuthGuard } from 'src/common/guard/clerk-auth.guard';
import { CodingService } from './coding.service';
import {
  CodingDiscussionDto,
  CodingSubmissionDto,
  DiscussionVoteDto,
  SubmisstionVoteDto,
} from './coding.dto';

@UseGuards(ClerkAuthGuard)
@Controller('coding')
export class CodingController {
  constructor(private readonly service: CodingService) { }

  @Post('submissions')
  submit(@Req() req: any, @Body() dto: CodingSubmissionDto) {
    return this.service.submitSolution(req.user, dto);
  }

  @Get('questions')
  getQuestions() {
    return this.service.getQuestions();
  }
  @Get('questions/:id')
  getQuestion(@Param('id') id: string) {
    return this.service.getQuestion(id);
  }
  @Post('submissions/vote')
  voteSubmission(@Req() req: any, @Body() dto: SubmisstionVoteDto) {
    return this.service.toggleSubmissionVote(req.user, dto);
  }

  @Get('questions/:id/submissions')
  getAccepted(@Param('id') id: string) {
    return this.service.getAcceptedSubmissions(id);
  }

  @Post('discussions')
  createDiscussion(@Req() req: any, @Body() dto: CodingDiscussionDto) {
    return this.service.createDiscussion(req.user, dto);
  }

  @Post('discussions/vote')
  voteDiscussion(@Req() req: any, @Body() dto: DiscussionVoteDto) {
    return this.service.toggleDiscussionVote(req.user, dto);
  }
  // /coding/problems/697401d43fb5894d915d7362/discussions
  @Get('questions/:id/discussions')
  getDiscussions(@Param('id') id: string) {
    return this.service.getDiscussions(id);
  }

  @Get('discussions/:id/replies')
  getReplies(@Param('id') id: string) {
    return this.service.getReplies(id);
  }
}
