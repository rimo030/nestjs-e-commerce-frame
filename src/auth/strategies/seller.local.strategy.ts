import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class SellerLocalStrategy extends PassportStrategy(Strategy, 'seller-local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateSeller({ email, password });
    console.log(user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
