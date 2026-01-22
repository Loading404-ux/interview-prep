import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ClerkAuthGuard } from 'src/common/guard/clerk-auth.guard';
import { ActivityService } from './activity.service';

@Controller('activity')
@UseGuards(ClerkAuthGuard)
export class ActivityController {
    constructor(private readonly service: ActivityService) { }

    @Get('history')
    getHistory(@Req() req) {
        return this.service.getHistory(req.user.id);
    }

    @Get('contributions')
    getContributions(@Req() req) {
        return this.service.getContributionCalendar(req.user.id);
    }

    @Get('streak')
    getStreak(@Req() req) {
        return this.service.getStreakData(req.user.id);
    }
}

