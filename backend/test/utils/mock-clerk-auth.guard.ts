import { CanActivate, ExecutionContext } from '@nestjs/common';

export class MockClerkAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    req.user = {
      id: '6973b36bc7c5e1e09e80546d', // Mongo ObjectId as string
      clerkUserId: 'user_3274BnLzwA5yevrixiG6jVxlOjF',
    };

    return true;
  }
}
