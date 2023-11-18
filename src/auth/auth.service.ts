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
    const [user] = await this.buyersRespository.find({
      where: { email: createUserDto.email },
      withDeleted: true,
      take: 1,
    });
    console.log(user);
    if (user) {
      throw new UnauthorizedException('this email already exists');
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const { password, ...other } = createUserDto;
    await this.buyersRespository.save({ hashedPassword, ...other });
  }

  async sellerSignUp(createSellerDto: CreateSellerDto): Promise<void> {
    const [user] = await this.sellersRespository.find({
      where: { email: createSellerDto.email },
      withDeleted: true,
      take: 1,
    });
    if (user) {
      throw new UnauthorizedException('this email already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createSellerDto.password, salt);
    const { password, ...other } = createSellerDto;
    await this.sellersRespository.save({ hashedPassword, ...other });
  }

  async validateUser(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    const user = await this.buyersRespository.findOneBy({ email: authCredentialsDto.email });
    if (user) {
      const isRightPassword = await bcrypt.compare(authCredentialsDto.password, user.hashedPassword);
      if (isRightPassword) {
        const { hashedPassword, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async validateSeller(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    const user = await this.sellersRespository.findOneBy({ email: authCredentialsDto.password });
    if (user) {
      const isRightPassword = await bcrypt.compare(authCredentialsDto.password, user.hashedPassword);
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
