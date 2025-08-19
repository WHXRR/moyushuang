import { Inject } from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatHistoryService } from 'src/chat-history/chat-history.service';
import { UserService } from 'src/user/user.service';
import { ChatroomService } from 'src/chatroom/chatroom.service';
import { ChatroomScheduleService } from 'src/chatroom/chatroom-schedule.service';

interface JoinRoomPayLoad {
  chatroomId: number;
  userId: number;
  username: string;
}

interface SendMessagePayload {
  userId: number;
  chatroomId: number;
  message: {
    type: 'text' | 'image' | 'file';
    content: string;
  };
}

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
})
export class ChatGateway {
  constructor(private readonly chatService: ChatService) { }
  @WebSocketServer() server: Server;

  private roomUserMap = new Map<number, Map<string, JoinRoomPayLoad>>();
  private statusCheckInterval: NodeJS.Timeout;

  @Inject(ChatroomScheduleService)
  private scheduleService: ChatroomScheduleService;

  onModuleInit() {
    this.statusCheckInterval = setInterval(() => {
      this.checkChatroomStatus();
    }, 60000);
  }

  onModuleDestroy() {
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
    }
  }

  private checkChatroomStatus() {
    const isOpen = this.scheduleService.isChatroomOpen();
    if (!isOpen) {
      this.server.emit('chatroomClosed');

      setTimeout(() => {
        this.server.disconnectSockets();
        this.roomUserMap.clear();
      }, 2000);
    }
  }

  handleConnection(client: Socket) {
    const isOpen = this.scheduleService.isChatroomOpen();
    if (!isOpen) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const socketId = client.id;

    for (const [roomId, userMap] of this.roomUserMap.entries()) {
      if (userMap.has(socketId)) {
        userMap.delete(socketId);

        if (userMap.size === 0) {
          this.roomUserMap.delete(roomId);
        } else {
          this.server
            .to(roomId.toString())
            .emit('userOffline', Array.from(userMap.values()));
        }

        break;
      }
    }
  }

  @Inject(ChatroomService)
  private chatroomService: ChatroomService;

  @SubscribeMessage('joinRoom')
  async joinRoom(client: Socket, payload: JoinRoomPayLoad) {
    const roomName = payload.chatroomId.toString();
    await client.join(roomName);
    const users = await this.chatroomService.getMembers(payload.chatroomId);
    this.server.to(roomName).emit('joinRoom', {
      ...payload,
      users,
    });
  }

  @SubscribeMessage('userOnline')
  async userOnline(client: Socket, payload: JoinRoomPayLoad) {
    const roomId = payload.chatroomId;
    const socketId = client.id;

    await client.join(roomId.toString());

    if (!this.roomUserMap.has(roomId)) {
      this.roomUserMap.set(roomId, new Map());
    }
    this.roomUserMap.get(roomId)!.set(socketId, payload);
    const onlineUsers = Array.from(this.roomUserMap.get(roomId)!.values());
    this.server.to(roomId.toString()).emit('userOnline', onlineUsers);
  }

  @Inject(ChatHistoryService)
  private chatHistoryService: ChatHistoryService;

  @Inject(UserService)
  private userService: UserService;

  @SubscribeMessage('sendMessage')
  async sendMessage(@MessageBody() payload: SendMessagePayload) {

    const isOpen = this.scheduleService.isChatroomOpen();
    if (!isOpen) {
      this.server.to(payload.chatroomId.toString()).emit('chatroomClosed');
      return;
    }

    const roomName = payload.chatroomId.toString();

    await this.chatHistoryService.add(payload.chatroomId, {
      content: payload.message.content,
      type:
        payload.message.type === 'text'
          ? 0
          : payload.message.type === 'image'
            ? 1
            : 2,
      chatroomId: payload.chatroomId,
      userId: payload.userId,
    });

    const sender = await this.userService.getUserInfo(payload.userId);

    this.server.to(roomName).emit('message', {
      type: 'sendMessage',
      content: payload.message.content,
      createTime: new Date().toISOString(),
      sender: {
        id: sender.id,
        createTime: sender.createTime,
        username: sender.username,
        email: sender.email,
        headPic: sender.headPic,
      },
    });
  }
}
