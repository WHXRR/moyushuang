import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtUserData } from 'src/guard/auth.guard';

export const NeedLogin = () => SetMetadata('need-login', true);

export const UserInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    if (!request.user) return null;
    const user = request.user;
    return data ? user[data as keyof JwtUserData] : user;
  },
);

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
