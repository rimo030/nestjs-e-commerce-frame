import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Payload } from 'src/interfaces/payload';
import { BuyersRespository } from 'src/repositories/buyers.repository';

@Injectable()
export class BuyerJwtStrategy extends PassportStrategy(Strategy, 'buyer-jwt') {
  constructor(
    @InjectRepository(BuyersRespository)
    private readonly buyersRespository: BuyersRespository,
    readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: Payload) {
    const { id } = payload;
    const member = await this.buyersRespository.findOneBy({ id });
    if (member) {
      return { id };
    }
    throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }
}