import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class BuyerJwtStrategy extends PassportStrategy(Strategy, 'buyer-jwt') {
  constructor(
    readonly authService: AuthService,
    readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET_BUYER'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: { id: number }): Promise<{ id: number }> {
    await this.authService.findBuyer(payload.id);
    return { id: payload.id };
  }
}
