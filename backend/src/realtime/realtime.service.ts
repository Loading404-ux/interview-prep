import { verifyToken } from '@clerk/backend';
import { Injectable } from '@nestjs/common';
import type { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { Server } from 'socket.io';
import { EVENTS } from './realtime.events';
import { WsException } from '@nestjs/websockets';
import { RealtimeEnvelope } from './realtime.types';

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
            client.join(`user:${user.id}`);

        } catch (err) {
            client.disconnect();
        }
    }

    handleEnvelope(client: Socket, envelope: RealtimeEnvelope) {
        if (!client.data.userId) {
            throw new WsException('Unauthorized');
        }

        switch (envelope.type) {
            case 'ROOM_JOIN':
                return this.joinRoom(client, envelope.metadata?.roomId);
            case 'ROOM_LEAVE':
                return this.leaveRoom(client, envelope.metadata?.roomId);
            case 'CHAT_MESSAGE':
                return this.forwardChatMessage(client, envelope);
            case 'PING':
                return { type: 'PONG', id: envelope.id };
            default:
                throw new WsException('Unknown message type');
        }
    }

    emitNotification(userId: string, payload: Record<string, any>) {
        if (!this.server) {
            throw new Error('WebSocket server not initialized');
        }

        this.server.to(`user:${userId}`).emit(EVENTS.NOTIFY, payload);
    }
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

    private joinRoom(client: Socket, roomId?: string) {
        if (!roomId) {
            throw new WsException('roomId is required');
        }
        client.join(roomId);
        return { joined: true, roomId };
    }

    private leaveRoom(client: Socket, roomId?: string) {
        if (!roomId) {
            throw new WsException('roomId is required');
        }
        client.leave(roomId);
        return { left: true, roomId };
    }

    private forwardChatMessage(client: Socket, envelope: RealtimeEnvelope) {
        const roomId = envelope.metadata?.roomId;
        if (!roomId) {
            throw new WsException('roomId is required');
        }

        this.server.to(roomId).emit(EVENTS.MESSAGE, {
            ...envelope,
            metadata: {
                ...envelope.metadata,
                senderId: client.data.userId,
            },
        });

        return { delivered: true, roomId, id: envelope.id };
    }
}
