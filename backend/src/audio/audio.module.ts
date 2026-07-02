import { Module } from "@nestjs/common"
import { AudioGateway } from "./audio.gateway"
import { AudioService } from "./audio.service"
import { AudioPipelineService } from "./audio-pipeline.service"

@Module({
    providers: [AudioGateway, AudioService, AudioPipelineService],
})
export class AudioModule { }
