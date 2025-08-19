import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { NeedLogin, Roles, UserInfo } from 'src/decorator/custom.decorator';
import { ChatroomScheduleService } from './chatroom-schedule.service';
import { ChatroomScheduleGuard } from 'src/guard/chatroom-schedule.guard';

@Controller('chatroom')
@NeedLogin()
export class ChatroomController {
  constructor(
    private readonly chatroomService: ChatroomService,
    private readonly scheduleService: ChatroomScheduleService
  ) { }

  @Get('status')
  async getChatroomStatus() {
    return {
      status: this.scheduleService.getControlMode(),
      isOpen: this.scheduleService.isChatroomOpen(),
      closeTime: this.scheduleService.getCloseTime(),
    }
  }

  @Post('set-control-mode')
  @Roles('admin')
  async setControlMode(@Body() body: { mode: 'auto' | 'manual' }) {
    this.scheduleService.setControlMode(body.mode);
    return {
      message: '设置成功',
    }
  }

  @Post('set-manual-status')
  @Roles('admin')
  async setManualStatus(@Body() body: { status: boolean }) {
    this.scheduleService.setManualStatus(body.status);
    return {
      message: '设置成功',
    }

  }


  @Get('joined-list')
  @UseGuards(ChatroomScheduleGuard)
  async joinedGroupList(
    @UserInfo('userId') userId: number,
    @Query('name') name: string,
  ) {
    return this.chatroomService.joinedList(userId, name);
  }

  @Get('not-joined-list')
  @UseGuards(ChatroomScheduleGuard)
  async notJoinedGroupList(
    @UserInfo('userId') userId: number,
    @Query('name') name: string,
  ) {
    return this.chatroomService.notJoinedList(userId, name);
  }

  @Get('list')
  @UseGuards(ChatroomScheduleGuard)
  async groupList(@Query('name') name: string) {
    return this.chatroomService.list(name);
  }

  @Get('create')
  @Roles('admin')
  @UseGuards(ChatroomScheduleGuard)
  async createGroup(
    @Query('name') name: string,
    @UserInfo('userId') userId: number,
  ) {
    return this.chatroomService.createGroup(name, userId);
  }

  @Put(':id')
  @Roles('admin')
  @UseGuards(ChatroomScheduleGuard)
  async updateGroup(
    @Param('id') chatroomId: number,
    @Body() body: { name: string },
  ) {
    return this.chatroomService.updateGroup(Number(chatroomId), body.name);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(ChatroomScheduleGuard)
  async deleteGroup(@Param('id') chatroomId: number) {
    return this.chatroomService.deleteGroup(Number(chatroomId));
  }

  @Get('members')
  @UseGuards(ChatroomScheduleGuard)
  async getChatroomMembers(
    @Query('chatroomId') chatroomId: number,
    @Query('limit') limit: number,
  ) {
    if (!chatroomId) {
      throw new BadRequestException('聊天室id不能为空');
    }

    return this.chatroomService.getMembers(chatroomId, limit);
  }

  @Get('info/:id')
  @UseGuards(ChatroomScheduleGuard)
  async getChatroomInfo(@Param('id') chatroomId: number) {
    if (!chatroomId) {
      throw new BadRequestException('聊天室id不能为空');
    }

    return this.chatroomService.getChatroomInfo(chatroomId);
  }

  @Get('join')
  @UseGuards(ChatroomScheduleGuard)
  async joinChatroom(
    @Query('chatroomId') chatroomId: number,
    @UserInfo('userId') userId: number,
  ) {
    if (!chatroomId) {
      throw new BadRequestException('聊天室id不能为空');
    }
    return this.chatroomService.joinChatroom(chatroomId, userId);
  }

  @Get('quit')
  @UseGuards(ChatroomScheduleGuard)
  async quitChatroom(
    @Query('chatroomId') chatroomId: number,
    @UserInfo('userId') userId: number,
  ) {
    if (!chatroomId) {
      throw new BadRequestException('聊天室id不能为空');
    }
    return this.chatroomService.quitChatroom(chatroomId, userId);
  }
}
