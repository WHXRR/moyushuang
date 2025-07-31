import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import {
  LoginUserDto,
  RegisterUserDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from './dto/register-user.dto';
import { NeedLogin, UserInfo } from 'src/decorator/custom.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }

  @Post('login')
  async login(@Body() loginUser: LoginUserDto) {
    return await this.userService.login(loginUser);
  }

  @Get('register-captcha')
  async getCaptcha(@Query('email') email: string) {
    return this.userService.getRegisterCaptcha(email);
  }

  @Get('info')
  @NeedLogin()
  async getUserInfo(@UserInfo('userId') userId: number) {
    return this.userService.getUserInfo(userId);
  }

  @Post('update-password')
  async updatePassword(@Body() updatePassword: UpdatePasswordDto) {
    return await this.userService.updatePassword(updatePassword);
  }

  @Get('update-password/captcha')
  async getUpdatePasswordCaptcha(@Query('email') email: string) {
    return this.userService.getUpdatePasswordCaptcha(email);
  }

  @Post('update')
  @NeedLogin()
  async update(
    @UserInfo('userId') userId: number,
    @Body() updateUser: UpdateUserDto,
  ) {
    return await this.userService.updateUserInfo(userId, updateUser);
  }
}
