import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HistoryDto, HistoryMessageDto } from './dto/chat-history.dto';

@Injectable()
export class ChatHistoryService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async list(chatroomId: number, offset = 0, limit = 100) {
    const history = await this.prismaService.chatHistory.findMany({
      where: {
        chatroomId,
      },
      orderBy: {
        createTime: 'desc',
      },
      skip: offset,
      take: limit,
    });

    const userIds = Array.from(new Set(history.map((item) => item.userId)));
    const userMap = new Map(
      (
        await this.prismaService.user.findMany({
          where: { id: { in: userIds } },
          select: {
            id: true,
            username: true,
            email: true,
            createTime: true,
            headPic: true,
          },
        })
      ).map((user) => [user.id, user]),
    );

    const res: HistoryMessageDto[] = history.map((item) => ({
      ...item,
      sender: userMap.get(item.userId) || null,
    }));

    const total = await this.prismaService.chatHistory.count({
      where: { chatroomId },
    });

    return {
      data: res,
      hasMore: offset + limit < total,
    };
  }

  async add(chatroomId: number, history: HistoryDto) {
    return this.prismaService.chatHistory.create({
      data: history,
    });
  }
}
