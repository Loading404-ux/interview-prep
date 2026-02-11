import { verifyToken } from '@clerk/backend';
import { Injectable } from '@nestjs/common';
import type { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { Server } from 'socket.io';
import { EVENTS } from './realtime.events';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class RealtimeService {
    private server: Server;

    constructor(private readonly authService: AuthService) { }

    setServer(server: Server) {
        this.server = server;
    }
    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth?.token;

            if (!token) {
                client.disconnect();
                return;
            }

            const payload = await verifyToken(token, {
                secretKey: process.env.CLERK_SECRET_KEY!,
            });

            const user = await this.authService.getOrCreateUserFromToken(payload.sub);

            // Attach user context to socket
            client.data.user = user;
            client.data.userId = user.id;

        } catch (err) {
            client.disconnect();
        }
    }
    //TODO: ADD THE SESSION ID WHEN USER CONNECTS TO THE WEBSOCKET
    emitHrStatus(sessionId: string, payload: any) {
        if (!this.server) {
            throw new Error('WebSocket server not initialized');
        }

        this.server
            .to(`hr_session:${sessionId}`)
            .emit(EVENTS.HR_STATUS, payload);
    }
    joinHrSession(client: Socket, sessionId: string) {
        if (!client.data.userId) {
            throw new WsException('Unauthorized');
        }

        client.join(`hr_session:${sessionId}`);

        return { joined: true };
    }
}
