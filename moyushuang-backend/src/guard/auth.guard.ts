import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

export interface JwtUserData {
  userId: number;
  username: string;
  role: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject(Reflector)
  private reflector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(PrismaService)
  private prisma: PrismaService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    const needLogin = this.reflector.getAllAndOverride<boolean>('need-login', [
      context.getClass(),
      context.getHandler(),
    ]);

    if (!needLogin) return true;

    const authHeader = request.headers['authorization'] as string;

    if (typeof authHeader !== 'string') {
      throw new UnauthorizedException('无效的授权头');
    }

    try {
      const token = authHeader.split(' ')[1];
      const data = this.jwtService.verify<JwtUserData>(token);

      const user = await this.prisma.user.findUnique({
        where: { id: data.userId },
        select: {
          id: true,
          username: true,
          role: true,
        },
      });

      if (!user) throw new UnauthorizedException('用户不存在');

      request.user = {
        userId: user.id,
        username: user.username,
        role: user.role,
      };

      response.header(
        'token',
        this.jwtService.sign(
          {
            userId: data.userId,
            username: data.username,
          },
          {
            expiresIn: '7d',
          },
        ),
      );
    } catch {
      throw new UnauthorizedException('token失效，请重新登录');
    }

    return true;
  }
}
