import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ChatroomScheduleService } from '../chatroom/chatroom-schedule.service';

@Injectable()
export class ChatroomScheduleGuard implements CanActivate {
  constructor(private readonly scheduleService: ChatroomScheduleService) { }

  canActivate(context: ExecutionContext): boolean {
    const isOpen = this.scheduleService.isChatroomOpen();

    if (!isOpen) {
      throw new ForbiddenException({
        statusCode: 403,
        error: '聊天室暂未开放',
      });
    }

    return true;
  }
}