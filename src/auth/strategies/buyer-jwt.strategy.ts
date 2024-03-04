import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-strategy';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { BuyerNotfoundException } from 'src/exceptions/auth.exception';
import { BuyerRepository } from 'src/repositories/buyer.repository';

@Injectable()
export class BuyerJwtStrategy extends PassportStrategy(Strategy, 'buyer-jwt') {
  constructor(
    @InjectRepository(BuyerRepository)
    private readonly buyersRespository: BuyerRepository,
    readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET_BUYER') ?? 'JWT_SECRET_BUYER',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: { id: number }): Promise<{ id: number }> {
    const user = await this.buyersRespository.findById(payload.id);
    if (user) {
      return { id: payload.id };
    }
    throw new BuyerNotfoundException();
  }
}
