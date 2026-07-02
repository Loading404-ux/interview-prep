import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { verifyToken, } from '@clerk/backend';
import { AuthService } from 'src/auth/auth.service';


@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(
    // @Inject('CLERK_CLIENT')
    //private readonly clerkClient: ClerkClient, // optional, for later use
    private readonly authService: AuthService,
  ) { }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();

    const authHeader = req.headers.authorization as string | undefined;
    const queryToken = req.query?.token as string | undefined;
    const token = authHeader
      ? authHeader.replace('Bearer ', '')
      : queryToken;
    if (!token) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    });
    if (!payload) {
      throw new UnauthorizedException('Invalid token');
    }
    req.user = await this.authService.getOrCreateUserFromToken(payload.sub);
    return true;
  }
}
