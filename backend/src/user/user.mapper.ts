import { User } from "src/schema/user.schema";

export class UserMapper {
    static UserResponse(data: Partial<User>) {
        return {
            email: data.email,
            name: data.name,
            clerkUserId: data.clerkUserId,
            avatar: data.profilePic,
            id: data._id,
        }
    }
}