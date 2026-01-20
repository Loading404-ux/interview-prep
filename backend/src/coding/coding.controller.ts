import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ClerkAuthGuard } from 'src/common/guard/clerk-auth.guard';
import { CreateCodingSubmissionDto } from './coding.dto';
import { CodingService } from './coding.service';

@Controller('coding')
@UseGuards(ClerkAuthGuard)
export class CodingController {
    constructor(private readonly service: CodingService) { }

    @Post("new-submission")
    async subbmition(@Req() req: any, @Body() dto: CreateCodingSubmissionDto) {
        return this.service.submitSolution(req.user.userId, dto);
    }
}