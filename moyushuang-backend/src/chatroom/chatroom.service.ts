import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatroomService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async joinedList(userId: number, name: string) {
    const roomIds = await this.prismaService.userChatroom.findMany({
      where: {
        userId,
      },
      select: {
        chatroomId: true,
      },
    });

    const rooms = await this.prismaService.chatroom.findMany({
      where: {
        id: {
          in: roomIds.map((item) => item.chatroomId),
        },
        name: {
          contains: name,
        },
      },
      select: {
        id: true,
        name: true,
        createTime: true,
        updateTime: true,
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    return rooms.map((room) => ({
      ...room,
      userCount: room._count.users,
    }));
  }

  async notJoinedList(userId: number, name: string) {
    const joinedRoomIds = await this.prismaService.userChatroom.findMany({
      where: {
        userId,
      },
      select: {
        chatroomId: true,
      },
    });

    const joinedIds = joinedRoomIds.map((item) => item.chatroomId);

    // 查找不在这些ID中的群聊
    const rooms = await this.prismaService.chatroom.findMany({
      where: {
        id: {
          notIn: joinedIds.length ? joinedIds : [0],
        },
        name: {
          contains: name,
        },
      },
      select: {
        id: true,
        name: true,
        createTime: true,
        updateTime: true,
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    return rooms.map((room) => ({
      ...room,
      userCount: room._count.users,
    }));
  }

  async list(name: string) {
    const rooms = await this.prismaService.chatroom.findMany({
      where: {
        name: {
          contains: name,
        },
      },
      select: {
        id: true,
        name: true,
        createTime: true,
        updateTime: true,
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    return rooms.map((room) => ({
      ...room,
      userCount: room._count.users,
    }));
  }

  async createGroup(name: string, userId: number) {
    const { id } = await this.prismaService.chatroom.create({
      data: {
        name,
      },
    });

    await this.prismaService.userChatroom.create({
      data: {
        userId,
        chatroomId: id,
      },
    });

    return '创建成功';
  }

  async updateGroup(chatroomId: number, name: string) {
    await this.prismaService.chatroom.update({
      where: { id: chatroomId },
      data: { name },
    });

    return '修改成功';
  }

  async deleteGroup(chatroomId: number) {
    await this.prismaService.chatHistory.deleteMany({
      where: { chatroomId },
    });

    await this.prismaService.userChatroom.deleteMany({
      where: { chatroomId },
    });

    await this.prismaService.chatroom.delete({
      where: { id: chatroomId },
    });

    return '删除成功';
  }

  async getMembers(chatroomId: number, limit?: number) {
    const userIds = await this.prismaService.userChatroom.findMany({
      where: {
        chatroomId,
      },
      select: {
        userId: true,
      },
    });

    const users = await this.prismaService.user.findMany({
      where: {
        id: {
          in: userIds.map((item) => item.userId),
        },
      },
      select: {
        id: true,
        username: true,
        headPic: true,
        createTime: true,
      },
      take: limit,
    });

    return users;
  }

  async getChatroomInfo(chatroomId: number) {
    const chatroom = await this.prismaService.chatroom.findUnique({
      where: {
        id: chatroomId,
      },
    });
    return { ...chatroom, users: await this.getMembers(chatroomId, 12) };
  }

  async joinChatroom(chatroomId: number, userId: number) {
    const chatroom = await this.prismaService.chatroom.findUnique({
      where: {
        id: chatroomId,
      },
    });
    if (!chatroom) {
      throw new BadRequestException('聊天室不存在');
    }

    const members = await this.getMembers(chatroomId);
    if (members.some((item) => item.id === userId)) {
      return {
        code: 201,
        message: '你已经在该聊天室啦',
      };
    }

    await this.prismaService.userChatroom.create({
      data: {
        userId,
        chatroomId,
      },
    });

    return {
      code: 200,
      message: '加入成功',
    };
  }

  async quitChatroom(chatroomId: number, userId: number) {
    const chatroom = await this.prismaService.chatroom.findUnique({
      where: {
        id: chatroomId,
      },
    });
    if (!chatroom) {
      throw new BadRequestException('聊天室不存在');
    }

    const userChatroom = await this.prismaService.userChatroom.findFirst({
      where: {
        userId,
        chatroomId,
      },
    });
    if (!userChatroom) {
      throw new BadRequestException('你不在该聊天室');
    }

    await this.prismaService.userChatroom.deleteMany({
      where: {
        userId,
        chatroomId,
      },
    });

    return '退出成功';
  }
}
