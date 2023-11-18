import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class BuyerLocalStrategy extends PassportStrategy(Strategy, 'buyer-local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'hashedPassword' });
  }

  async validate(email: string, hashedPassword: string): Promise<any> {
    const user = await this.authService.validateUser({ email, hashedPassword });
    console.log(user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
