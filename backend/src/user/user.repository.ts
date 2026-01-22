import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/schema/user.schema";
import { CreateUser } from "./user.dto";

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
}