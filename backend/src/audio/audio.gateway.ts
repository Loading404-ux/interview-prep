import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
    SubscribeMessage,
    WebSocketGateway,
} from "@nestjs/websockets"
import type { Socket } from "socket.io"
import type { Server } from "socket.io"
import { AudioService } from "./audio.service"
import { AUDIO_EVENTS } from "./audio.events"
import type { AudioChunkPayload } from "./audio.types"

@WebSocketGateway({
    cors: {
        origin: "*",
    },
    namespace: "/audio",
})
export class AudioGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly audioService: AudioService) { }

    @WebSocketServer()
    server: Server

    handleConnection(client: Socket) {
        this.audioService.setServer(this.server)
        return this.audioService.handleConnection(client)
    }

    handleDisconnect(client: Socket) {
        return this.audioService.handleDisconnect(client)
    }

    @SubscribeMessage(AUDIO_EVENTS.JOIN)
    handleJoin(
        @ConnectedSocket() client: Socket,
        @MessageBody() body: { sessionId: string }
    ) {
        return this.audioService.joinSession(client, body.sessionId)
    }

    @SubscribeMessage(AUDIO_EVENTS.CHUNK)
    handleChunk(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: AudioChunkPayload
    ) {
        return this.audioService.handleChunk(client, payload)
    }

    @SubscribeMessage("audio_chunk")
    handleChunkLegacy(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: AudioChunkPayload
    ) {
        return this.audioService.handleChunk(client, payload)
    }
}
