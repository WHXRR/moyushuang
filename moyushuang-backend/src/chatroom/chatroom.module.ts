import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomController } from './chatroom.controller';
import { ChatroomScheduleService } from './chatroom-schedule.service';

@Module({
  controllers: [ChatroomController],
  providers: [ChatroomService, ChatroomScheduleService],
  exports: [ChatroomService, ChatroomScheduleService],
})
export class ChatroomModule {}
