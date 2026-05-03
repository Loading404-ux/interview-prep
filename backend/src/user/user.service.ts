import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserMapper } from './user.mapper';
import { UserProgressService } from './user-progress.service';
import { ActivityService } from 'src/activity/activity.service';
import { UserAchievement } from 'src/schema/user_achievements.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schema/user.schema';
import { UpdateProfileDto } from './user.dto';


@Injectable()
export class UserService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly progressService: UserProgressService,
        private readonly activityService: ActivityService,
        @InjectModel(UserAchievement.name)
        private readonly achievementModel: Model<UserAchievement>,
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
    ) { }

    async getUser(userId: string) {
        const res = await this.userRepo.findById(userId);
        if (!res) {
            throw new NotFoundException('User not found');
        }
        if (!res.isActive) {
            throw new ForbiddenException('User is not active');
        }
        return UserMapper.UserResponse(res);
    }
    async getProfile(userId: string, clerkUserId: string) {
        const [progress, contributions, achievements, user] = await Promise.all([
            this.progressService.getProgressOverview(new Types.ObjectId(userId)),
            this.activityService.getContributionCalendar(clerkUserId, 90),
            this.achievementModel.find({ userId: new Types.ObjectId(userId) }),
            this.userModel.findById(userId),
        ]);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return {
            profile: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.profilePic,
                university: user.university,
                targetCompanies: user.targetCompanies,
                memberSince: user.createdAt,
            },
            progress,
            // streak: progress.streak,
            contributions,
            achievements: achievements.map(a => ({
                key: a.achievementKey,
                unlockedAt: a.unlockedAt,
            })),
            targets: user.targetCompanies
        };
    }
    async updateProfile(userId: string, dto: UpdateProfileDto) {
        await this.userRepo.updateById(userId, dto);
        return { success: true };
    }
    async updateTargets(userId: string, targets: string[]) {
        await this.userRepo.updateById(userId, { targetCompanies: targets });
        return { success: true };
    }
    async getContributionCalendar(clerkUserId: string, days = 90) {
        return this.activityService.getContributionCalendar(clerkUserId, days);
    }
    getStreakCalendar(clerkUserId: string, days = 90) {
        return this.activityService.getStreakCalendar(clerkUserId, days);
    }
}
