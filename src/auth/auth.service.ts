import bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/services/prisma.service';
import { AuthCredentialsDto } from '../entities/dtos/auth-credentials.dto';
import { CreateBuyerDto } from '../entities/dtos/create-buyer.dto';
import { CreateSellerDto } from '../entities/dtos/create-seller.dto';
import {
  BuyerNotfoundException,
  BuyerUnauthrizedException,
  SellerNotfoundException,
  SellerUnauthrizedException,
} from '../exceptions/auth.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async buyerSignUp(createBuyerDto: CreateBuyerDto): Promise<void> {
    const buyer = await this.prisma.buyer.findUnique({ select: { id: true }, where: { email: createBuyerDto.email } });

    if (buyer) {
      throw new BuyerUnauthrizedException();
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createBuyerDto.password, salt);
    createBuyerDto.password = hashedPassword;

    await this.prisma.buyer.create({ data: { ...createBuyerDto } });
  }

  async sellerSignUp(createSellerDto: CreateSellerDto): Promise<void> {
    const seller = await this.prisma.seller.findUnique({
      select: { id: true },
      where: { email: createSellerDto.email },
    });

    if (seller) {
      throw new SellerUnauthrizedException();
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createSellerDto.password, salt);
    createSellerDto.password = hashedPassword;

    await this.prisma.seller.create({ data: { ...createSellerDto } });
  }

  async validateBuyer(authCredentialsDto: AuthCredentialsDto): Promise<{ id: number }> {
    const buyer = await this.prisma.buyer.findUnique({
      select: { id: true, password: true },
      where: { email: authCredentialsDto.email },
    });

    if (buyer) {
      const isRightPassword = await bcrypt.compare(authCredentialsDto.password, buyer.password);
      if (isRightPassword) {
        return { id: buyer.id };
      }
      throw new BuyerNotfoundException();
    }
    throw new BuyerNotfoundException();
  }

  async validateSeller(authCredentialsDto: AuthCredentialsDto): Promise<{ id: number }> {
    const seller = await this.prisma.seller.findUnique({
      select: { id: true, password: true },
      where: { email: authCredentialsDto.email },
    });

    if (seller) {
      const isRightPassword = await bcrypt.compare(authCredentialsDto.password, seller.password);
      if (isRightPassword) {
        return { id: seller.id };
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
