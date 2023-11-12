import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from 'src/entities/dtos/auth-credentials.dto';
import { UserRespository } from 'src/repositories/user.repository';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { AccessToken } from 'src/interfaces/access-token';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRespository)
    private userRespository: UserRespository,
    private jwtService: JwtService,
  ) {}

  // email-password를 받아 회원 가입
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { email, password } = authCredentialsDto;
    const user = await this.userRespository.findOneBy({ email });
    if (user) {
      // 등록된 유저라면 error
      throw new UnauthorizedException('this email already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt); // 비밀번호 암호화
    const member = this.userRespository.create({ email, hashedPassword });
    await this.userRespository.save(member);
  }

  // email-password을 받아 등록된 유저인지 확인후 토큰 반환
  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<AccessToken> {
    const { email, password } = authCredentialsDto;
    const user = await this.userRespository.findOneBy({ email });

    // 등록된 유저인지 확인
    if (user) {
      const isRightPassword = await bcrypt.compare(password, user.hashedPassword);
      if (isRightPassword) {
        const payload = { id: user.id };
        const accessToken = await this.jwtService.sign(payload); // 유저 id로 토큰 생성 (Secret + payload)
        return { accessToken }; // 토큰 반환
      }
    }
    throw new UnauthorizedException('login faild');
  }
}
