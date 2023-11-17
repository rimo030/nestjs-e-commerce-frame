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

  async buyerSignUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const user = await this.userRespository.findOneBy({ email: authCredentialsDto.email });
    if (user) {
      throw new UnauthorizedException('this email already exists');
    }
    const salt = await bcrypt.genSalt();
    authCredentialsDto.password = await bcrypt.hash(authCredentialsDto.password, salt);
    await this.userRespository.save({ ...authCredentialsDto });
  }

  async signUpSeller(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const user = await this.sellersRespository.findOneBy({ email: authCredentialsDto.email });
    if (user) {
      throw new UnauthorizedException('this email already exists');
    }
    const salt = await bcrypt.genSalt();
    authCredentialsDto.password = await bcrypt.hash(authCredentialsDto.password, salt);
    await this.sellersRespository.save({ ...authCredentialsDto });
  }

  // 비밀번호 확인
  async validateUser(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    const { email, password } = authCredentialsDto;
    const user = await this.userRespository.findOneBy({ email });
    if (user) {
      const isRightPassword = await bcrypt.compare(password, user.hashedPassword);
      if (isRightPassword) {
        const { hashedPassword, ...result } = user;
        return result;
      }
    }
    return null;
  }

  // 토큰 발행
  async login(user: any) {
    const payload = { id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
