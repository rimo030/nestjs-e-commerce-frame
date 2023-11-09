import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from 'src/entities/user.entity';
import { UserRespository } from 'src/repositories/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRespository)
    private userRespository: UserRespository,
  ) {
    super({
      secretOrKey: 'secretNumber',
      jwtFromResquest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload) {
    const { email } = payload;
    const user: UserEntity | null = await this.userRespository.findOneBy({
      email,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
