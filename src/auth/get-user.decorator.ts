import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ExternalContextCreator } from '@nestjs/core';
import { UserEntity } from 'src/entities/user.entity';

export const User = createParamDecorator(
  (data, ctx: ExecutionContext): UserEntity => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
