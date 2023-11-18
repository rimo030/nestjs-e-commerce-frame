import { Strategy } from 'passport-local';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BuyerAuthResult } from 'src/interfaces/buyer-auth-result';
import { AuthService } from '../auth.service';

@Injectable()
export class BuyerLocalStrategy extends PassportStrategy(Strategy, 'buyer-local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string): Promise<BuyerAuthResult> {
    const user = await this.authService.validateBuyer({ email, password });
    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
