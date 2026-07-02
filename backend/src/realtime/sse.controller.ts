import { Controller, Req, Sse, UseGuards } from "@nestjs/common"
import { ClerkAuthGuard } from "src/common/guard/clerk-auth.guard"
import { SseService } from "./sse.service"

@Controller("realtime")
@UseGuards(ClerkAuthGuard)
export class SseController {
    constructor(private readonly sseService: SseService) { }

    @Sse("notifications")
    stream(@Req() req: any) {
        return this.sseService.createStream(req.user.id)
    }
}
