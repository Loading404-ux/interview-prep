import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ClerkAuthGuard } from 'src/common/guard/clerk-auth.guard';
import { UserService } from './user.service';
import { UserProgressService } from './user-progress.service';
import { UpdateProfileDto, UpdateTargetsDto } from './user.dto';
import { UserMetricsMapper } from './user.mapper';

@Controller('user')
@UseGuards(ClerkAuthGuard)
// @Roles('admin')
export class UserController {

    constructor(private readonly service: UserService, private readonly progressService: UserProgressService) { }

    @Get('profile')
    async getUserProfile(@Req() req: any) {
        return this.service.getUser(req.user._id);
    }
    @Get("me/metrics")
    async getMyMetrics(@Req() req) {
        const metrics = await this.progressService.findOrCreate(req.user._id)
        return UserMetricsMapper.toDashboard(metrics)
    }
    @Get('me/progress')
    getMyProgress(@Req() req: any) {
        return this.progressService.getProgressOverview(req.user._id);
    }
    @Get('me/dashboard')
    async getDashboard(@Req() req: any) {
        return this.service.getDashboard(req.user);
    }
    @Patch('me/profile')
    updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
        return this.service.updateProfile(req.user._id, dto);
    }
    @Patch('me/targets')
    updateTargets(@Req() req: any, @Body() dto: UpdateTargetsDto) {
        return this.service.updateTargets(req.user._id, dto.targetCompanies);
    }
    @Get('me/achievements')
    getAchievements(@Req() req: any) {
        return this.service.getAchievements(req.user._id);
    }

}