import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { NeedLogin, Roles, UserInfo } from 'src/decorator/custom.decorator';

@Controller('chatroom')
@NeedLogin()
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @Get('joined-list')
  async joinedGroupList(
    @UserInfo('userId') userId: number,
    @Query('name') name: string,
  ) {
    return this.chatroomService.joinedList(userId, name);
  }
  @Get('not-joined-list')
  async notJoinedGroupList(
    @UserInfo('userId') userId: number,
    @Query('name') name: string,
  ) {
    return this.chatroomService.notJoinedList(userId, name);
  }

  @Get('list')
  async groupList(@Query('name') name: string) {
    return this.chatroomService.list(name);
  }

  @Get('create')
  @Roles('admin')
  async createGroup(
    @Query('name') name: string,
    @UserInfo('userId') userId: number,
  ) {
    return this.chatroomService.createGroup(name, userId);
  }

  @Put(':id')
  @Roles('admin')
  async updateGroup(
    @Param('id') chatroomId: number,
    @Body() body: { name: string },
  ) {
    return this.chatroomService.updateGroup(Number(chatroomId), body.name);
  }

  @Delete(':id')
  @Roles('admin')
  async deleteGroup(@Param('id') chatroomId: number) {
    return this.chatroomService.deleteGroup(Number(chatroomId));
  }

  @Get('members')
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
  async getChatroomInfo(@Param('id') chatroomId: number) {
    if (!chatroomId) {
      throw new BadRequestException('聊天室id不能为空');
    }

    return this.chatroomService.getChatroomInfo(chatroomId);
  }

  @Get('join')
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
