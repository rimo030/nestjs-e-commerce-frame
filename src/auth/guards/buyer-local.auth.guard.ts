import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class BuyerLocalAuthGuard extends AuthGuard('buyer-local') {}
