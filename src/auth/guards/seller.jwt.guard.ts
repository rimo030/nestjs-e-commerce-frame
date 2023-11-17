import { AuthGuard } from '@nestjs/passport';

export class SellerJwtAuthGuard extends AuthGuard('seller-jwt') {}
