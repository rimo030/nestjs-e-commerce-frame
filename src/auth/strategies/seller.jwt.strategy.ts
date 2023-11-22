import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Payload } from 'src/interfaces/payload';
import { SellersRespository } from 'src/repositories/sellers.repository';

@Injectable()
export class SellerJwtStrategy extends PassportStrategy(Strategy, 'seller-jwt') {
  constructor(
    @InjectRepository(SellersRespository)
    private readonly sellersRespository: SellersRespository,
    readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET_SELLER'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: Payload) {
    const { id } = payload;
    const member = await this.sellersRespository.findOneBy({ id });
    if (member) {
      return { id };
    }
    throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }
}
