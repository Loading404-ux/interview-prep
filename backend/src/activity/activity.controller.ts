import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ClerkAuthGuard } from 'src/common/guard/clerk-auth.guard';
import { ActivityService } from './activity.service';

@UseGuards(ClerkAuthGuard)
@Controller('activity')
export class ActivityController {
  constructor(private readonly service: ActivityService) {}

  @Get('history')
  getHistory(@Req() req: any) {
    return this.service.getHistory(req.user.clerkUserId);
  }

  @Get('contributions')
  getContributions(@Req() req: any) {
    return this.service.getContributionCalendar(req.user.clerkUserId);
  }

  @Get('streak')
  getStreak(@Req() req: any) {
    return this.service.getStreak(req.user.clerkUserId);
  }
}


