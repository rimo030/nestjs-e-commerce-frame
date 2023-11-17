import { AuthGuard } from '@nestjs/passport';

export class BuyerJwtAuthGuard extends AuthGuard('buyer-jwt') {}
