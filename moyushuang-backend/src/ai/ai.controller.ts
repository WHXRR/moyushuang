import { Controller, Post, Body, Get, Delete, UseGuards, Res, Sse, Query } from '@nestjs/common';
import { AiService } from './ai.service';
import { NeedLogin, UserInfo } from '../decorator/custom.decorator';
import { GenerateCatMessageDto } from './dto/ai.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Response } from 'express';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) { }

  @NeedLogin()
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

  @NeedLogin()
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

  @NeedLogin()
  @Get('memory')
  async getUserMemory(@UserInfo('userId') userId: number) {
    const memory = this.aiService.getUserMemory(userId);
    return {
      success: true,
      data: memory,
    };
  }

  @NeedLogin()
  @Delete('memory')
  async clearUserMemory(@UserInfo('userId') userId: number) {
    await this.aiService.clearUserMemory(userId);
    return {
      success: true,
      message: '记忆已清除',
    };
  }

  @Post('summary')
  async summaryArticle(@Body() body: { article: string }) {
    const { article } = body;
    const summary = await this.aiService.summaryArticle(article);
    return {
      success: true,
      data: {
        summary,
      },
    };
  }

  @Post('summary-stream')
  async summaryArticleStream(
    @Body() body: { article: string },
    @Res() res: Response,
  ) {
    const { article } = body;
    // 设置SSE响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    try {
      // 发送开始信号
      res.write(`data: ${JSON.stringify({ type: 'start', message: '开始分析文章...' })}\n\n`);

      const stream = await this.aiService.summaryArticleStream(article);

      for await (const chunk of stream) {
        res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
      }

      // 发送完成信号
      res.write(`data: ${JSON.stringify({ type: 'done', message: '总结完成' })}\n\n`);
      res.end();
    } catch (error) {
      res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
      res.end();
    }
  }
}
