import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserEntity } from 'src/entities/user.entity';

export const UserId = createParamDecorator((data, ctx: ExecutionContext): UserEntity => {
  const req = ctx.switchToHttp().getRequest();
  return req.user.id;
});
