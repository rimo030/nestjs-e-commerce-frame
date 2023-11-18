import { Strategy } from 'passport-local';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { SellerAuthResult } from 'src/interfaces/seller-auth-result';
import { AuthService } from '../auth.service';

@Injectable()
export class SellerLocalStrategy extends PassportStrategy(Strategy, 'seller-local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string): Promise<SellerAuthResult> {
    const user = await this.authService.validateSeller({ email, password });
    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
