import { Controller, Post, Body, Get, Delete, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { NeedLogin, UserInfo } from '../decorator/custom.decorator';
import { GenerateCatMessageDto } from './dto/ai.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('ai')
@NeedLogin()
export class AiController {
  constructor(private readonly aiService: AiService) { }

  @Post('cat-message')
  @UseGuards(ThrottlerGuard)
  @Throttle({ short: { limit: 3, ttl: 60000 } })
  @Throttle({ medium: { limit: 10, ttl: 600000 } })
  @Throttle({ long: { limit: 20, ttl: 3600000 } })
  async generateCatMessage(
    @UserInfo('userId') userId: number,
    @Body() generateCatMessageDto: GenerateCatMessageDto,
  ) {
    const { event } = generateCatMessageDto;
    const message = await this.aiService.generateCatMessage(userId, event);
    return {
      success: true,
      data: {
        message,
      },
    };
  }

  @Get('memory')
  async getUserMemory(@UserInfo('userId') userId: number) {
    const memory = this.aiService.getUserMemory(userId);
    return {
      success: true,
      data: memory,
    };
  }

  @Delete('memory')
  async clearUserMemory(@UserInfo('userId') userId: number) {
    await this.aiService.clearUserMemory(userId);
    return {
      success: true,
      message: '记忆已清除',
    };
  }
}
