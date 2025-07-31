import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InitService implements OnModuleInit {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async onModuleInit() {
    await this.initializeDefaultChatroom();
  }

  private async initializeDefaultChatroom() {
    try {
      // 检查是否已存在默认聊天室
      const existingChatroom = await this.prismaService.chatroom.findFirst({
        where: {
          name: '技术交流',
        },
      });

      if (!existingChatroom) {
        // 创建默认聊天室
        const defaultChatroom = await this.prismaService.chatroom.create({
          data: {
            name: '技术交流',
          },
        });

        console.log(`✅ 默认聊天室创建成功，ID: ${defaultChatroom.id}`);
      } else {
        console.log(`✅ 默认聊天室已存在，ID: ${existingChatroom.id}`);
      }
    } catch (error) {
      console.error('❌ 创建默认聊天室失败:', error);
    }
  }
}
