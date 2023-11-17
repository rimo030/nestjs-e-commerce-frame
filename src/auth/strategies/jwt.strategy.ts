import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { BuyerEntity } from 'src/entities/user.entity';
import { BuyersRespository } from 'src/repositories/users.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(BuyersRespository)
    private readonly userRespository: BuyersRespository,
    readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  // payload를 받아서 user Entity를 찾고 반환
  async validate(payload) {
    const { id } = payload; // 페이로드에서 id 추출

    // DB에서 등록되어있는지 확인
    const member: BuyerEntity | null = await this.userRespository.findOneBy({
      id,
    });
    if (!member) {
      throw new UnauthorizedException();
    }
    return member;
  }
}
