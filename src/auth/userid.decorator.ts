import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { BuyerEntity } from 'src/entities/buyer.entity';

export const UserId = createParamDecorator((data, ctx: ExecutionContext): number => {
  const req = ctx.switchToHttp().getRequest();
  return req.user.id;
});
