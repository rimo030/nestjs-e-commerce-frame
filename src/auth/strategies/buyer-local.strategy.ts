import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class BuyerLocalStrategy extends PassportStrategy(Strategy, 'buyer-local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string): Promise<{ id: number }> {
    const id = await this.authService.validateBuyer({ email, password });
    return id;
  }
}
