import { Controller, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ClerkAuthGuard } from 'src/common/guard/clerk-auth.guard';

@Controller('user')
@UseGuards(ClerkAuthGuard)
@Roles('admin')
export class UserController {}
