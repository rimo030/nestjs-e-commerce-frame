import bcrypt from 'bcryptjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from 'src/entities/dtos/auth-credentials.dto';
import { CreateBuyerDto } from 'src/entities/dtos/create-buyer.dto';
import { CreateSellerDto } from 'src/entities/dtos/create-seller.dto';
import { AccessToken } from 'src/interfaces/access-token';
import { BuyerAuthResult } from 'src/interfaces/buyer-auth-result';
import { Payload } from 'src/interfaces/payload';
import { SellerAuthResult } from 'src/interfaces/seller-auth-result';
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

  async buyerLogin(buyerAuthResult: BuyerAuthResult): Promise<AccessToken> {
    const payload: Payload = { id: buyerAuthResult.id };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }

  async sellrLogin(sellerAuthResult: SellerAuthResult): Promise<AccessToken> {
    const payload: Payload = { id: sellerAuthResult.id };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }
}
