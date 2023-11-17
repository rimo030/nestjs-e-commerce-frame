import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from 'src/entities/dtos/auth-credentials.dto';
import { UsersRespository } from 'src/repositories/users.repository';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { AccessToken } from 'src/interfaces/access-token';
import { SellersRespository } from 'src/repositories/sellers.repository';
import { CreateBuyerDto } from 'src/entities/dtos/create-buyer.dto';
import { CreateSellerDto } from 'src/entities/dtos/create-seller.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRespository)
    private readonly userRespository: UsersRespository,
    private readonly sellersRespository: SellersRespository,
    private readonly jwtService: JwtService,
  ) {}

  async buyerSignUp(createUserDto: CreateBuyerDto): Promise<void> {
    const user = await this.userRespository.findOneBy({ email: createUserDto.email });
    if (user) {
      throw new UnauthorizedException('this email already exists');
    }
    const salt = await bcrypt.genSalt();
    createUserDto.hashedPassword = await bcrypt.hash(createUserDto.hashedPassword, salt);
    await this.userRespository.save({ ...createUserDto });
  }

  async sellerSignUp(createSellerDto: CreateSellerDto): Promise<void> {
    const user = await this.sellersRespository.findOneBy({ email: createSellerDto.email });
    if (user) {
      throw new UnauthorizedException('this email already exists');
    }
    const salt = await bcrypt.genSalt();
    createSellerDto.hashedPassword = await bcrypt.hash(createSellerDto.hashedPassword, salt);
    await this.sellersRespository.save({ ...createSellerDto });
  }

  async validateUser(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    const { email, hashedPassword: password } = authCredentialsDto;
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

  async validateSeller(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    const { email, hashedPassword: password } = authCredentialsDto;
    const user = await this.sellersRespository.findOneBy({ email });
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
    console.log(user.id);
    const payload = { id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
