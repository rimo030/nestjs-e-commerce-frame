import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Payload } from 'src/interfaces/payload';
import { SellerRepository } from 'src/repositories/seller.repository';

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

  async validate(payload: Payload) {
    const { id } = payload;
    const member = await this.sellerRepository.findOneBy({ id });
    if (member) {
      return { id };
    }
    throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }
}
