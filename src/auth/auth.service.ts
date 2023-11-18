import * as bcrypt from 'bcryptjs';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from 'src/entities/dtos/auth-credentials.dto';
import { CreateBuyerDto } from 'src/entities/dtos/create-buyer.dto';
import { CreateSellerDto } from 'src/entities/dtos/create-seller.dto';
import { AccessToken } from 'src/interfaces/access-token';
import { BuyersRespository } from 'src/repositories/buyers.repository';
import { SellersRespository } from 'src/repositories/sellers.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(BuyersRespository)
    private readonly buyersRespository: BuyersRespository,
    @InjectRepository(SellersRespository)
    private readonly sellersRespository: SellersRespository,
    private readonly jwtService: JwtService,
  ) {}

  async buyerSignUp(createUserDto: CreateBuyerDto): Promise<void> {
    const user = await this.buyersRespository.findOneBy({ email: createUserDto.email });
    if (user) {
      throw new UnauthorizedException('this email already exists');
    }
    const salt = await bcrypt.genSalt();
    createUserDto.hashedPassword = await bcrypt.hash(createUserDto.hashedPassword, salt);
    await this.buyersRespository.save({ ...createUserDto });
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
    const user = await this.buyersRespository.findOneBy({ email });
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
