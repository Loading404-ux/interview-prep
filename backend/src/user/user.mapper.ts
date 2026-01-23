import { User } from "src/schema/user.schema";

export class UserMapper {
    static UserResponse(data: Partial<User>) {
        return {
            email: data.email,
            name: data.name,
            clerkUserId: data.clerkUserId,
            // college: data.university,
            avatar: data.profilePic,
            // targetCompanies: data.targetCompanies,
            id: data._id,
            // joinedDate: new Date(data.createdAt!).toDateString()
        }
    }
}