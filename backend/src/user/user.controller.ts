import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ClerkAuthGuard } from 'src/common/guard/clerk-auth.guard';
import { UserService } from './user.service';
import { UserProgressService } from './user-progress.service';
import { UpdateProfileDto, UpdateTargetsDto } from './user.dto';

@Controller('user')
@UseGuards(ClerkAuthGuard)
// @Roles('admin')
export class UserController {

    constructor(private readonly service: UserService, private readonly progressService: UserProgressService) { }

    @Post('profile')
    async verifyUser(@Req() req: any) {
        return this.service.getUser(req.user.id);
    }

    @Get('dashboard/cards')
    async dashboardCard(@Req() req: any) {
        return this.progressService.getProgressOverview(req.user.id);
    }

    @Get('dashboard/streak')
    async getStreak(@Req() req: any) {
        return this.progressService.getStreak(req.user.id);
    }

    @Get('me/profile')
    getAchievements(@Req() req: any) {
        return this.service.getProfile(req.user.id, req.user.clerkUserId);
    }
    @Get('me/contributions')
    getContributions(@Req() req: any) {
        return this.service.getContributionCalendar(req.user.clerkUserId);
    }
    @Get('dashboard/streak-calendar')
    getStreakCalendar(@Req() req: any) {
        return this.service.getStreakCalendar(req.user.clerkUserId, 90);
    }
    @Patch('me/profile')
    updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
        return this.service.updateProfile(req.user.id, dto);
    }

    @Patch('me/targets')
    updateTargets(@Req() req: any, @Body() dto: UpdateTargetsDto) {
        return this.service.updateTargets(req.user.id, dto.targetCompanies);
    }


}