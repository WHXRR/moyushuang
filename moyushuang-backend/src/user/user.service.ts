import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import {
  LoginUserDto,
  RegisterUserDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from './dto/register-user.dto';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private prisma: PrismaService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(EmailService)
  private emailService: EmailService;

  private logger = new Logger();

  async register(user: RegisterUserDto) {
    const captcha = await this.redisService.get(`captcha_${user.email}`);

    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (user.captcha !== captcha) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.prisma.user.findUnique({
      where: {
        username: user.username,
      },
    });

    if (foundUser) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }

    const foundEmail = await this.prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (foundEmail) {
      throw new HttpException('该邮箱已被注册', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    try {
      return await this.prisma.user.create({
        data: {
          username: user.username,
          password: hashedPassword,
          email: user.email,
        },
        select: {
          id: true,
          username: true,
          email: true,
          headPic: true,
          createTime: true,
        },
      });
    } catch (error) {
      this.logger.error(error, UserService);
      return null;
    }
  }

  async getRegisterCaptcha(email: string) {
    const foundEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (foundEmail) {
      throw new HttpException('该邮箱已被注册', HttpStatus.BAD_REQUEST);
    }

    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(`captcha_${email}`, code, 60 * 5);

    await this.emailService.sendMail({
      to: email,
      subject: '魔域爽注册验证码',
      html: `<p>您的注册验证码为：${code}，欢迎加入魔域大家庭</p>`,
    });

    return '发送成功';
  }

  async login(user: LoginUserDto) {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (!foundUser) {
      throw new HttpException('未找到该用户', HttpStatus.BAD_REQUEST);
    }

    const isMatch = await bcrypt.compare(user.password, foundUser.password);
    if (!isMatch) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }

    return {
      ...foundUser,
      password: '',
      token: this.jwtService.sign(
        {
          userId: foundUser.id,
          username: foundUser.username,
        },
        {
          expiresIn: '7d',
        },
      ),
    };
  }

  async getUserInfo(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        headPic: true,
        createTime: true,
        role: true,
      },
    });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async updatePassword(updatePassword: UpdatePasswordDto) {
    const { password, captcha, email } = updatePassword;
    const foundUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!foundUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    const realCaptcha = await this.redisService.get(
      `update_password_captcha_${email}`,
    );
    if (!realCaptcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }
    if (realCaptcha !== captcha) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    foundUser.password = hashedPassword;
    try {
      await this.prisma.user.update({
        where: {
          id: foundUser.id,
        },
        data: foundUser,
      });
      return '修改成功';
    } catch (e) {
      this.logger.error(e, UserService);
      return '修改失败';
    }
  }

  async getUpdatePasswordCaptcha(email: string) {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!foundUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(
      `update_password_captcha_${foundUser.email}`,
      code,
      60 * 5,
    );
    await this.emailService.sendMail({
      to: foundUser.email,
      subject: '修改密码验证码',
      html: `<p>您的验证码是: ${code}</p>`,
    });
    return '发送成功';
  }

  async updateUserInfo(userId: number, updateUser: UpdateUserDto) {
    const foundUsername = await this.prisma.user.findUnique({
      where: {
        username: updateUser.username,
      },
    });

    if (foundUsername && foundUsername.id !== userId) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!foundUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    foundUser.headPic = updateUser.headPic
      ? updateUser.headPic
      : foundUser.headPic;
    foundUser.username = updateUser.username
      ? updateUser.username
      : foundUser.username;

    try {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: foundUser,
      });
      return '修改成功';
    } catch (e) {
      this.logger.error(e, UserService);
      return '修改失败';
    }
  }
}
