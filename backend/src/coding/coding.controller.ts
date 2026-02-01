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
  DiscussionReplyDto,
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
  getSubmissions(@Param('id') id: string) {
    return this.service.getSubmissionsByQuestion(id);
  }

  @Patch('submission/:id/vote')
  toggleSubmissionVotes(@Req() req: any, @Body() dto: SubmisstionVoteDto) {
    return this.service.toggleSubmissionVotes(req.user.id, req.user.clerkUserId, dto);
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
  toggleDiscussionVotes(@Req() req: any, @Body() dto: DiscussionVoteDto) {
    return this.service.toggleDiscussionVotes(req.user.id, req.user.clerkUserId, dto);
  }

  // @Get('discussion/replies')
  // getReplys(@Body() data: DiscussionReplyDto) {
  //   return this.service.getReplies(data.parentId, data.questionId);
  // }
}