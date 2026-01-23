import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserMapper } from './user.mapper';
import { UserProgressService } from './user-progress.service';
import { ActivityService } from 'src/activity/activity.service';
import { UserAchievement } from 'src/schema/user_achievements.schema';
import { Model } from 'mongoose';
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
    async getDashboard(user: User) {
        const [progress, contributions, achievements] = await Promise.all([
            this.progressService.getProgressOverview(user._id),
            this.activityService.getContributionCalendar(user.clerkUserId),
            this.achievementModel.find({ userId: user._id }),
        ]);

        return {
            profile: {
                id: user._id,
                name: user.name,
                email: user.email,
                university: user.university,
                avatar: user.profilePic,
                targetCompanies: user.targetCompanies,
                memberSince: user.createdAt,
            },
            progress,
            streak: progress.streak,
            contributions,
            achievements: achievements.map(a => ({
                key: a.achievementKey,
                unlockedAt: a.unlockedAt,
            })),
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
    async getAchievements(userId: string) {
        const achievements = await this.achievementModel.find({ userId });
        return achievements.map(a => ({
            key: a.achievementKey,
            unlockedAt: a.unlockedAt,
        }));
    }

}
