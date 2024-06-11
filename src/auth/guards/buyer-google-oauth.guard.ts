import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class BuyerGoogleOAuthGuard extends AuthGuard('buyer-google') {}
