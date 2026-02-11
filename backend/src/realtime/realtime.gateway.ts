// import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

// @WebSocketGateway()
// export class RealtimeGateway {
//   @SubscribeMessage('message')
//   handleMessage(client: any, payload: any): string {
//     return 'Hello world!';
//   }
// }


// realtime.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RealtimeService } from './realtime.service';
import { EVENTS } from './realtime.events';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/realtime',
})
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly realtimeService: RealtimeService) { }
  afterInit() {
    // 🔥 THIS is where server comes from
    this.realtimeService.setServer(this.server);
  }
  handleConnection(client: Socket) {
    this.realtimeService.handleConnection(client);
  }

  handleDisconnect(client: Socket) {
    client.disconnect();
  }

  // @SubscribeMessage(EVENTS.HR_JOIN)
  // handleHrJoin(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() body: { sessionId: string },
  // ) {
  //   return this.realtimeService.joinHrSession(client, body.sessionId);
  // }
  @SubscribeMessage('hr.join.v1')
  handleHrJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { sessionId: string },
  ) {
    return this.realtimeService.joinHrSession(client, body.sessionId);
  }
}



// CLIENT-SIDE
// io("http://localhost:3000/realtime", {
//   auth: {
//     token: accessToken,
//   },
// });

// import { io } from 'socket.io-client';

// export const socket = io('http://localhost:3000/realtime', {
//   auth: {
//     token: clerkToken, // 🔐
//   },
// });