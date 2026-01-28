import type { ClerkClient } from "@clerk/backend";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserRepository } from "src/user/user.repository";
import { JwtPayload } from "@clerk/backend/jwt"
import {UserMapper} from "src/user/user.mapper"
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    @Inject('CLERK_CLIENT')
    private readonly clerkClient: ClerkClient,
  ) { }

  async getOrCreateUserFromToken(sub: NonNullable<JwtPayload['sub']>) {
    let user = await this.userRepo.findByClerkUserId(sub);
    const clerk = await this.clerkClient.users.getUser(sub);
    if (!user) {
      user = await this.userRepo.createUser({
        clerkUserId: sub,
        email: clerk.emailAddresses[0].emailAddress,
        name: `${clerk.firstName ?? ''} ${clerk.lastName ?? ''}`.trim(),
        profilePic: clerk.imageUrl,
      });
      const email = clerk.emailAddresses[0].emailAddress.split("@")[1];
    }
   
    // if (email !== "@kiit.ac.in") throw new UnauthorizedException('This is only for KIIT students!');
    return UserMapper.UserResponse(user);
  }
}
