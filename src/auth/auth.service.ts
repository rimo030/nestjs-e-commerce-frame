import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from 'src/entities/dtos/auth-credentials.dto';
import { UsersRespository } from 'src/repositories/users.repository';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { AccessToken } from 'src/interfaces/access-token';
import { SellersRespository } from 'src/repositories/sellers.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRespository)
    private readonly userRespository: UsersRespository,
    private readonly sellersRespository: SellersRespository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const user = await this.userRespository.findOneBy({ email: authCredentialsDto.email });
    if (user) {
      throw new UnauthorizedException('this email already exists');
    }
    const salt = await bcrypt.genSalt();
    authCredentialsDto.hashedPassword = await bcrypt.hash(authCredentialsDto.hashedPassword, salt);
    await this.userRespository.save({ ...authCredentialsDto });
  }

  async signUpSeller(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const user = await this.sellersRespository.findOneBy({ email: authCredentialsDto.email });
    if (user) {
      throw new UnauthorizedException('this email already exists');
    }
    const salt = await bcrypt.genSalt();
    authCredentialsDto.hashedPassword = await bcrypt.hash(authCredentialsDto.hashedPassword, salt);
    await this.sellersRespository.save({ ...authCredentialsDto });
  }

  // email-password을 받아 등록된 유저인지 확인후 토큰 반환
  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<AccessToken> {
    const { email, hashedPassword: password } = authCredentialsDto;
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
