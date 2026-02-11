import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/schema/user.schema";
import { CreateUser } from "./user.dto";
import { UserAchievement } from "src/schema/user_achievements.schema";

@Injectable()
export class UserRepository {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    findByEmail(email: string) {
        return this.userModel.findOne({ email });
    }
    findById(id: string) {
        return this.userModel.findById(id);
    }

    findByClerkUserId(clerkUserId: string) {
        return this.userModel.findOne({ clerkUserId });
    }
    createUser(user: CreateUser) {
        return this.userModel.create(user);
    }
    updateById(userId: string, data: Partial<User>) {
        return this.userModel.updateOne({ _id: userId }, data);
    }

}

@Injectable()
export class UserAchievementRepository {
    constructor(@InjectModel(UserAchievement.name) private userModel: Model<UserAchievement>) { }
}


@Injectable()
export class UserMatrixRepository {
    constructor(@InjectModel(UserAchievement.name) private userModel: Model<UserAchievement>) { }
}