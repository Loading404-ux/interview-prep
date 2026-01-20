import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ClerkAuthGuard } from './common/guard/clerk-auth.guard';
import { RolesGuard } from './common/guard/roles.guard';
import { Roles } from './common/decorators/roles.decorator';

// @Controller()
@Controller('admin')
@UseGuards(ClerkAuthGuard, RolesGuard)
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }



  @Get()
  @Roles('admin')
  getAdminData() {
    return { message: 'Admin access granted' }
  }
}
