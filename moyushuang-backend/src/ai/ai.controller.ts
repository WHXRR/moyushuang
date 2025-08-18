import { Controller, Post, Body, Get, Delete, UseGuards, Res, Sse, Query, Headers } from '@nestjs/common';
import { AiService } from './ai.service';
import { NeedLogin, UserInfo } from '../decorator/custom.decorator';
import { GenerateCatMessageDto } from './dto/ai.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Response } from 'express';
import { interval, map, Observable, take } from 'rxjs';

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

  @Sse('cat-message-stream')
  @UseGuards(ThrottlerGuard)
  @Throttle({ short: { limit: 3, ttl: 60000 } })
  @Throttle({ medium: { limit: 10, ttl: 600000 } })
  @Throttle({ long: { limit: 20, ttl: 3600000 } })
  async generateCatMessageStream(
    @Query('event') event: string,
    @Query('userId') userId: string,
    @Res() res: Response,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    try {
      const stream = await this.aiService.generateCatMessageStream(Number(userId), event);
      for await (const chunk of stream) {
        res.write(`data: ${chunk}\n\n`);
      }
      res.end();
    } catch (error) {
      res.write(`data: ${JSON.stringify({ type: 'error', message: '生成消息失败' })}\n\n`);
      res.end();
    }
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
