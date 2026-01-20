import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import type { Request } from 'express';
import type { ClerkClient } from '@clerk/backend';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(
    @Inject('CLERK_CLIENT')
    private readonly clerkClient: ClerkClient,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    // Comes from clerkMiddleware()
    const auth = (req as any).auth;

    if (!auth || !auth.isAuthenticated) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Optional but recommended: fetch backend user
    const user = await this.clerkClient.users.getUser(auth.userId);

    // Attach for downstream use
    (req as any).user = user;

    return true;
  }
}
