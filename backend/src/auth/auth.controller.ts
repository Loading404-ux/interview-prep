import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ClerkAuthGuard } from 'src/common/guard/clerk-auth.guard';

@Controller('auth')
@UseGuards(ClerkAuthGuard)
export class AuthController {

    @Get('profile')
    async profile(@Req() req: any) {
        console.log(req.user);
        return { user: req.user };
    }
}
