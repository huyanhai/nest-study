import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type TMessage = {
  name: string;
  msg: string;
  time: number;
};

type TUserInfo = {
  time: number;
  id: string;
};

@WebSocketGateway(4000, { cors: true })
export class WSGateway implements OnGatewayInit, OnGatewayDisconnect {
  users: Map<TUserInfo['id'], TUserInfo> = new Map();
  messages: TMessage[] = [];

  @WebSocketServer()
  server: Server;

  afterInit() {
    this.server.on('connection', (socket: Socket) => {
      const now = Date.now();
      if (!this.users.has(socket.id)) {
        this.users.set(socket.id, {
          time: now,
          id: socket.id,
        });
      }
      this.server.emit('server', this.users.size);
      this.server.emit('enter', socket.id);
    });
  }

  handleDisconnect(client: any) {
    if (this.users.has(client.id)) {
      this.users.delete(client.id);
    }
    this.server.emit('server', this.users.size);
    this.server.emit('leave', client.id);
  }

  @SubscribeMessage('sendMessage')
  sendMessage(@MessageBody() body: TMessage) {
    if (body?.name) {
      this.messages.push(body);
    }
    this.server.emit('message', this.messages);
  }
}
