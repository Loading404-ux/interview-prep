import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { clerkClient } from '@clerk/clerk-sdk-node'

@Injectable()
export class CompanyEmailGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const { userId } = request.user

    const user = await clerkClient.users.getUser(userId)

    const email = user.emailAddresses[0]?.emailAddress
    if (!email?.endsWith('@yourcompany.com')) {
      throw new ForbiddenException('Unauthorized company access')
    }

    return true
  }
}
