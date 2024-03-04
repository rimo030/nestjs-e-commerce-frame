import bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from '../entities/dtos/auth-credentials.dto';
import { CreateBuyerDto } from '../entities/dtos/create-buyer.dto';
import { CreateSellerDto } from '../entities/dtos/create-seller.dto';
import {
  BuyerNotfoundException,
  BuyerUnauthrizedException,
  SellerNotfoundException,
  SellerUnauthrizedException,
} from '../exceptions/auth.exception';
import { BuyerRepository } from '../repositories/buyer.repository';
import { SellerRepository } from '../repositories/seller.repository';

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

  async validateBuyer(authCredentialsDto: AuthCredentialsDto): Promise<{ id: number }> {
    const user = await this.buyersRespository.findByEmail(authCredentialsDto.email);
    if (user) {
      const isRightPassword = await bcrypt.compare(authCredentialsDto.password, user.password);
      if (isRightPassword) {
        return { id: user.id };
      }
      throw new BuyerNotfoundException();
    }
    throw new BuyerNotfoundException();
  }

  async validateSeller(authCredentialsDto: AuthCredentialsDto): Promise<{ id: number }> {
    const user = await this.sellersRespository.findByEmail(authCredentialsDto.email);
    if (user) {
      const isRightPassword = await bcrypt.compare(authCredentialsDto.password, user.password);
      if (isRightPassword) {
        return { id: user.id };
      }
      throw new SellerNotfoundException();
    }
    throw new SellerNotfoundException();
  }

  async buyerLogin(id: number): Promise<{ accessToken: string }> {
    const payload: { id: number } = { id };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET_BUYER') ?? 'JWT_SECRET_BUYER',
    });
    return { accessToken };
  }

  async sellerLogin(id: number): Promise<{ accessToken: string }> {
    const payload: { id: number } = { id };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET_SELLER') ?? 'JWT_SECRET_SELLER',
    });
    return { accessToken };
  }
}
