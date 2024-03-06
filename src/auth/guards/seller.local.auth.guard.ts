import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SellerLocalAuthGuard extends AuthGuard('seller-local') {}
