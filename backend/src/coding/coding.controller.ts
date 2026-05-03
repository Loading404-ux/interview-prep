import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
    return this.service.addSubmission(req.user.id, req.user.clerkUserId, dto);
  }

  @Get('submission/:id')
  getSubmissions(@Param('id') id: string, @Req() req: any) {
    return this.service.getSubmissionsByQuestion(id, req.user.id);
  }

  @Patch('submission/:id/vote')
  toggleSubmissionVotes(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: SubmisstionVoteDto,
  ) {
    const payload = { submissionId: dto?.submissionId ?? id } as SubmisstionVoteDto;
    return this.service.toggleSubmissionVotes(req.user.id, req.user.clerkUserId, payload);
  }

  @Post('discussion')
  addDiscussion(@Req() req: any, @Body() dto: CodingDiscussionDto) {
    return this.service.addDiscussion({
      userId: req.user.id,
      clerkUserId: req.user.clerkUserId,
      questionId: dto.questionId,
      text: dto.content,
      parentId: dto.parentId
    });
  }

  @Get('discussion')
  getDiscussions(
    @Req() req: any,
    @Query('problemId') problemId: string,
    @Query('parentId') parentId?: string,
  ) {
    return this.service.getDiscussions({
      questionId: problemId,
      parentId: parentId || null,
      userId: req.user.id
    });
  }

  @Patch('discussion/:id/vote')
  toggleDiscussionVotes(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: DiscussionVoteDto,
  ) {
    const payload = { discussionId: dto?.discussionId ?? id } as DiscussionVoteDto;
    return this.service.toggleDiscussionVotes(req.user.id, req.user.clerkUserId, payload);
  }

}