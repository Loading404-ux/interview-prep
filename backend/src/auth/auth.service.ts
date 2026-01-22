import type { ClerkClient } from "@clerk/backend";
import { Inject, Injectable } from "@nestjs/common";
import { UserRepository } from "src/user/user.repository";

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    @Inject('CLERK_CLIENT')
    private readonly clerkClient: ClerkClient,
  ) {}

  async getOrCreateUserFromToken(sub: string) {
    let user = await this.userRepo.findByClerkUserId(sub);
    if (user) return user;

    const clerk = await this.clerkClient.users.getUser(sub);

    return this.userRepo.createUser({
      clerkUserId: sub,
      email: clerk.emailAddresses[0].emailAddress,
      name: `${clerk.firstName ?? ''} ${clerk.lastName ?? ''}`.trim(),
      profilePic: clerk.imageUrl,
    });
  }
}
