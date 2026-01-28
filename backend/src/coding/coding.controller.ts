import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
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

  @Get('questions')
  getQuestions() {
    return this.service.getQuestions();
  }

  @Get('question/:id')
  getQuestion(@Param('id') id: string) {
    return this.service.questionById(id);
  }

  @Post('submit-solution')
  submitSolution(@Req() req: any, @Body() dto: CodingSubmissionDto) {
    return this.service.addSubmission(req.user.id, dto);
  }
  @Get('submission/:id')
  getSubmission(@Param('id') id: string) {
    return this.service.getSubmissionsByQuestion(id);
  }
  @Patch('submission/:id/vote')
  toggleSubmissionVotes(@Req() req: any, @Body() dto: SubmisstionVoteDto) {
    return this.service.toggleSubmissionVotes(req.user.id, req.user.clerkUserId, dto);
  }

  @Post('discussion')
  addDiscussion(@Req() req: any, @Body() dto: CodingDiscussionDto) {
    return this.service.addDiscussion(req.user.id, dto.content, dto.parentId);
  }
  @Get('discussion/:id')
  getDiscussions(@Param('id') id: string) {
    return this.service.getDiscussions(id);
  }
  @Patch('discussion/:id/vote')
  toggleDiscussionVotes(@Req() req: any, @Body() dto: DiscussionVoteDto) {
    return this.service.toggleDiscussionVotes(req.user.id, req.user.clerkUserId, dto);
  }
}
