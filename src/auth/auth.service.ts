import bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from 'src/entities/dtos/auth-credentials.dto';
import { CreateBuyerDto } from 'src/entities/dtos/create-buyer.dto';
import { CreateSellerDto } from 'src/entities/dtos/create-seller.dto';
import {
  BuyerNotfoundException,
  BuyerUnauthrizedException,
  SellerNotfoundException,
  SellerUnauthrizedException,
} from 'src/exceptions/auth.exception';
import { AccessToken } from 'src/interfaces/access-token.interface';
import { BuyerAuthResult } from 'src/interfaces/buyer-auth-result.interface';
import { Payload } from 'src/interfaces/payload.interface';
import { SellerAuthResult } from 'src/interfaces/seller-auth-result.interface';
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

  async buyerSignUp(createBuyerDto: CreateBuyerDto): Promise<void> {
    const user = await this.buyersRespository.findByEmail(createBuyerDto.email);
    if (user) {
      throw new BuyerUnauthrizedException();
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createBuyerDto.password, salt);
    createBuyerDto.password = hashedPassword;

    await this.buyersRespository.saveBuyer(createBuyerDto);
  }

  async sellerSignUp(createSellerDto: CreateSellerDto): Promise<void> {
    const user = await this.sellersRespository.findByEmail(createSellerDto.email);
    if (user) {
      throw new SellerUnauthrizedException();
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createSellerDto.password, salt);
    createSellerDto.password = hashedPassword;

    await this.sellersRespository.saveSeller(createSellerDto);
  }

  async validateBuyer(authCredentialsDto: AuthCredentialsDto): Promise<BuyerAuthResult> {
    const user = await this.buyersRespository.findOneBy({ email: authCredentialsDto.email });
    if (user) {
      const isRightPassword = await bcrypt.compare(authCredentialsDto.password, user.hashedPassword);
      if (isRightPassword) {
        const { hashedPassword, ...result } = user;
        return result;
      }
      throw new BuyerNotfoundException();
    }
    throw new BuyerNotfoundException();
  }

  async validateSeller(authCredentialsDto: AuthCredentialsDto): Promise<SellerAuthResult> {
    const user = await this.sellersRespository.findOneBy({ email: authCredentialsDto.email });
    if (user) {
      const isRightPassword = await bcrypt.compare(authCredentialsDto.password, user.hashedPassword);
      if (isRightPassword) {
        const { hashedPassword, ...result } = user;
        return result;
      }
      throw new SellerNotfoundException();
    }
    throw new SellerNotfoundException();
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
