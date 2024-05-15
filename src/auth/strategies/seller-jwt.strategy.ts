import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class SellerJwtStrategy extends PassportStrategy(Strategy, 'seller-jwt') {
  constructor(
    readonly authService: AuthService,
    readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET_SELLER'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: { id: number }): Promise<{ id: number }> {
    await this.authService.findSeller(payload.id);
    return { id: payload.id };
  }
}
