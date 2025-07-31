import { Controller, Get, Query } from '@nestjs/common';
import { ChatHistoryService } from './chat-history.service';
import { NeedLogin } from 'src/decorator/custom.decorator';

@Controller('chat-history')
@NeedLogin()
export class ChatHistoryController {
  constructor(private readonly chatHistoryService: ChatHistoryService) {}

  @Get('list')
  async list(
    @Query('chatroomId') chatroomId: number,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ) {
    return this.chatHistoryService.list(chatroomId, offset, limit);
  }
}
