import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const UserId = createParamDecorator((data, ctx: ExecutionContext): number => {
  const req = ctx.switchToHttp().getRequest();
  return Number(req.user.id);
});
