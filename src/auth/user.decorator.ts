import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((data, ctx: ExecutionContext): number => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
