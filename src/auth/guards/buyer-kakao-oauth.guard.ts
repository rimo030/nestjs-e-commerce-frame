import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class BuyerKakaoOAuthGuard extends AuthGuard('buyer-kakao') {}
