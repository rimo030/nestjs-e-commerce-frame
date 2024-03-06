import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { SellerNotfoundException } from '../../exceptions/auth.exception';
import { SellerRepository } from '../../repositories/seller.repository';

@Injectable()
export class SellerJwtStrategy extends PassportStrategy(Strategy, 'seller-jwt') {
  constructor(
    @InjectRepository(SellerRepository)
    private readonly sellerRepository: SellerRepository,
    readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET_SELLER') ?? 'JWT_SECRET_SELLER',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: { id: number }): Promise<{ id: number }> {
    const user = await this.sellerRepository.findById(payload.id);
    if (user) {
      return { id: payload.id };
    }
    throw new SellerNotfoundException();
  }
}
