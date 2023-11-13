import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserEntity } from 'src/entities/user.entity';

export const UserId = createParamDecorator((data, ctx: ExecutionContext): number => {
  const req = ctx.switchToHttp().getRequest();
  return req.user.id;
});
