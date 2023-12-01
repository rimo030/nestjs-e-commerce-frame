import bcrypt from 'bcryptjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from 'src/entities/dtos/auth-credentials.dto';
import { CreateBuyerDto } from 'src/entities/dtos/create-buyer.dto';
import { CreateSellerDto } from 'src/entities/dtos/create-seller.dto';
import { AccessToken } from 'src/interfaces/access-token';
import { BuyerAuthResult } from 'src/interfaces/buyer-auth-result';
import { Payload } from 'src/interfaces/payload';
import { SellerAuthResult } from 'src/interfaces/seller-auth-result';
import { BuyerRepository } from 'src/repositories/buyer.repository';
import { SellerRepository } from 'src/repositories/seller.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(BuyerRepository)
    private readonly buyersRespository: BuyerRepository,

    @InjectRepository(SellerRepository)
    private readonly sellersRespository: SellerRepository,

    private readonly jwtService: JwtService,
    readonly configService: ConfigService,
  ) {}

  async buyerSignUp(createUserDto: CreateBuyerDto): Promise<void> {
    const [user] = await this.buyersRespository.find({
      where: { email: createUserDto.email },
      withDeleted: true,
      take: 1,
    });
    if (user) {
      throw new HttpException('this email already exists', HttpStatus.UNAUTHORIZED);
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
      throw new HttpException('this email already exists', HttpStatus.UNAUTHORIZED);
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createSellerDto.password, salt);
    const { password, ...other } = createSellerDto;
    await this.sellersRespository.save({ hashedPassword, ...other });
  }

  async validateBuyer(authCredentialsDto: AuthCredentialsDto): Promise<BuyerAuthResult> {
    const user = await this.buyersRespository.findOneBy({ email: authCredentialsDto.email });
    if (user) {
      const isRightPassword = await bcrypt.compare(authCredentialsDto.password, user.hashedPassword);
      if (isRightPassword) {
        const { hashedPassword, ...result } = user;
        return result;
      }
      throw new HttpException('password is incorrect', HttpStatus.UNAUTHORIZED);
    }
    throw new HttpException('this email does not exists', HttpStatus.UNAUTHORIZED);
  }

  async validateSeller(authCredentialsDto: AuthCredentialsDto): Promise<SellerAuthResult> {
    const user = await this.sellersRespository.findOneBy({ email: authCredentialsDto.email });
    if (user) {
      const isRightPassword = await bcrypt.compare(authCredentialsDto.password, user.hashedPassword);
      if (isRightPassword) {
        const { hashedPassword, ...result } = user;
        return result;
      }
      throw new HttpException('password is incorrect', HttpStatus.UNAUTHORIZED);
    }
    throw new HttpException('this email does not exists', HttpStatus.UNAUTHORIZED);
  }

  async buyerLogin(buyerId: number): Promise<AccessToken> {
    const payload: Payload = { id: buyerId };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET_BUYER') ?? 'JWT_SECRET_BUYER',
    });
    return { accessToken };
  }

  async sellerLogin(sellerId: number): Promise<AccessToken> {
    const payload: Payload = { id: sellerId };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET_SELLER') ?? 'JWT_SECRET_SELLER',
    });
    return { accessToken };
  }
}
