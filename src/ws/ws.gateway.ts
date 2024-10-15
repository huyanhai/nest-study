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
    if (this.users.size === 0) {
      this.messages = [];
    }
    this.server.emit('server', this.users.size);
    this.server.emit('leave', client.id);
  }

  // 发送消息
  @SubscribeMessage('sendMessage')
  sendMessage(@MessageBody() body: TMessage) {
    if (body?.name) {
      this.messages.push(body);
    }
    this.server.emit('message', this.messages);
  }

  // 请求通话
  @SubscribeMessage('call')
  call(
    @MessageBody()
    body: {
      // 远端id
      remoteUserId: string;
      // 本地id
      localUserId: string;
    },
  ) {
    console.log('call', body);

    this.server.to(body.remoteUserId).emit('call', body);
  }

  // 允许视频通话
  @SubscribeMessage('acceptCall')
  acceptCall(@MessageBody() body: { roomId: string }) {
    this.server.to(body.roomId).emit('acceptCall');
  }

  // 处理offer
  @SubscribeMessage('offer')
  offer(
    @MessageBody() body: { offer: RTCSessionDescriptionInit; roomId: string },
  ) {
    this.server.to(body.roomId).emit('offer', body.offer);
  }

  // 处理answer
  @SubscribeMessage('answer')
  answer(
    @MessageBody() body: { answer: RTCSessionDescriptionInit; roomId: string },
  ) {
    this.server.to(body.roomId).emit('answer', body.answer);
  }

  // 传递视频流
  @SubscribeMessage('video')
  video(
    @MessageBody()
    body: {
      type: string;
      remoteUserId: string;
      candidate: RTCIceCandidate;
    },
  ) {
    this.server.to(body.remoteUserId).emit('video', {
      type: body.type,
      candidate: body.candidate,
    });
  }
}
