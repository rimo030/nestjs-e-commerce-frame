import bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/services/prisma.service';
import { AuthCredentialsDto } from '../dtos/auth-credentials.dto';
import { CreateBuyerDto } from '../dtos/create-buyer.dto';
import { CreateSellerDto } from '../dtos/create-seller.dto';
import {
  AuthForbiddenException,
  BuyerUnauthrizedException,
  SellerEmailNotFoundException,
  SellerNotFoundException,
  SellerUnauthrizedException,
} from '../exceptions/auth.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 구매자 회원가입 기능입니다.
   * buyer를 저장합니다. 비밀번호는 암호화 됩니다.
   *
   * @param createBuyerDto 저장할 buyer의 데이터 입니다.
   */
  async buyerSignUp(createBuyerDto: CreateBuyerDto): Promise<{ id: number }> {
    const { email, password, name, gender, age, phone } = createBuyerDto;
    const buyer = await this.prisma.buyer.findUnique({ select: { id: true }, where: { email } });

    if (buyer) {
      throw new BuyerUnauthrizedException();
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const buyerId = await this.prisma.buyer.create({
      select: { id: true },
      data: { email, password: hashedPassword, name, gender, age, phone },
    });

    return buyerId;
  }

  /**
   * 판매자 회원가입 기능입니다.
   * seller를 저장합니다. 비밀번호는 암호화 됩니다.
   *
   * @param createSellerDto 저장할 seller의 데이터 입니다.
   */
  async sellerSignUp(createSellerDto: CreateSellerDto): Promise<{ id: number }> {
    const { email, password, name, phone, businessNumber } = createSellerDto;
    const seller = await this.prisma.seller.findUnique({
      select: { id: true },
      where: { email },
    });

    if (seller) {
      throw new SellerUnauthrizedException();
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const sellerId = await this.prisma.seller.create({
      select: { id: true },
      data: { email, password: hashedPassword, name, phone, businessNumber },
    });
    return sellerId;
  }

  /**
   * buyer의 로그인시 비밀번호가 올바른지 검사합니다.
   * passport의 validate로 호출됩니다.
   *
   * @param authCredentialsDto buyer의 이메일과 비밀번호 입니다.
   */
  async validateBuyer(authCredentialsDto: AuthCredentialsDto): Promise<{ id: number }> {
    const buyer = await this.prisma.buyer.findUnique({
      select: { id: true, password: true },
      where: { email: authCredentialsDto.email },
    });

    if (buyer && buyer.password) {
      const isRightPassword = await bcrypt.compare(authCredentialsDto.password, buyer.password);
      if (isRightPassword) {
        return { id: buyer.id };
      }
      throw new SellerNotFoundException();
    }
    throw new SellerNotFoundException();
  }

  /**
   * buyer의 구글 로그인을 처리합니다.
   * 등록되지 않은 이메일일 경우 새로 buyer를 생성합니다. 등록된 경우 jwt 토큰을 발행합니다.
   *
   * @param BuyerGoogleCredentialsDto BuyerGoogleStrategy에서 전달된 정보입니다.
   */
  async buyerGoogleOAuthLogin(BuyerGoogleCredentialsDto: {
    email: string | undefined;
    name: string | undefined;
    accessToken: string;
  }): Promise<{ accessToken: string }> {
    const { email, name } = BuyerGoogleCredentialsDto;

    if (email && name) {
      const buyer = await this.prisma.buyer.findUnique({ select: { id: true }, where: { email } });

      if (!buyer) {
        const buyerId = await this.prisma.buyer.create({
          select: { id: true },
          data: { email, name },
        });
        const accessToken = this.jwtService.sign(buyerId, {
          secret: this.configService.get('JWT_SECRET_BUYER'),
        });
        return { accessToken };
      }

      return this.buyerLogin(buyer.id);
    }

    throw new AuthForbiddenException();
  }

  /**
   * buyer의 카카오 로그인을 처리합니다.
   * 등록되지 않은 이메일일 경우 새로 buyer를 생성합니다. 등록된 경우 jwt 토큰을 발행합니다.
   *
   * @param BuyerKakaoCredentialsDto BuyerKakaoStrategy에서 전달된 정보입니다.
   */
  async buyerKakaoOAuthLogin(BuyerKakaoCredentialsDto: {
    kakaoId: string | undefined;
    name: string | undefined;
    accessToken: string;
  }): Promise<{ accessToken: string }> {
    const { kakaoId, name } = BuyerKakaoCredentialsDto;

    if (kakaoId && name) {
      const buyer = await this.prisma.buyer.findUnique({ select: { id: true }, where: { email: `${kakaoId}` } });

      if (!buyer) {
        const buyerId = await this.prisma.buyer.create({
          select: { id: true },
          data: { email: `${kakaoId}`, name },
        });
        const accessToken = this.jwtService.sign(buyerId, {
          secret: this.configService.get('JWT_SECRET_BUYER'),
        });
        return { accessToken };
      }

      return this.buyerLogin(buyer.id);
    }

    throw new AuthForbiddenException();
  }

  /**
   * seller의 로그인시 비밀번호가 올바른지 검사합니다.
   * passport의 validate로 호출됩니다.
   *
   * @param authCredentialsDto seller의 이메일과 비밀번호 입니다.
   */
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
      throw new SellerNotFoundException();
    }
    throw new SellerNotFoundException();
  }

  /**
   * buyer 로그인시 accessToken을 발급합니다.
   * @param id JWT의 페이로드가 될 buyer의 id 입니다.
   */
  async buyerLogin(id: number): Promise<{ accessToken: string }> {
    const payload: { id: number } = { id };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET_BUYER'),
    });
    return { accessToken };
  }

  /**
   * seller 로그인시 accessToken을 발급합니다.
   * @param id JWT의 페이로드가 될 seller의 id 입니다.
   */
  async sellerLogin(id: number): Promise<{ accessToken: string }> {
    const payload: { id: number } = { id };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET_SELLER'),
    });
    return { accessToken };
  }

  /**
   * buyer의 이메일이 존재하는지 조회합니다.
   * @param email 조회할 buyer의 이메일 입니다.
   */
  async findBuyerEmail(email: string): Promise<{ id: number }> {
    const buyerId = await this.prisma.buyer.findUnique({
      select: { id: true },
      where: { email },
    });

    if (!buyerId) {
      throw new SellerEmailNotFoundException();
    }
    return buyerId;
  }

  /**
   * seller 의 이메일이 존재하는지 조회합니다.
   * @param email 조회할 seller의 이메일 입니다.
   */
  async findSellerEmail(email: string): Promise<{ id: number }> {
    const sellerId = await this.prisma.seller.findUnique({
      select: { id: true },
      where: { email },
    });

    if (!sellerId) {
      throw new SellerEmailNotFoundException();
    }
    return sellerId;
  }

  /**
   * buyer의 id가 존재하는지 조회 합니다.
   * @param id 조회할 buyer의 id입니다.
   */
  async findBuyer(id: number): Promise<{ id: number }> {
    const buyerId = await this.prisma.buyer.findUnique({
      select: { id: true },
      where: { id },
    });

    if (!buyerId) {
      throw new AuthForbiddenException();
    }
    return buyerId;
  }

  /**
   * seller의 id가 존재하는지 조회 합니다.
   * @param id 조회할 seller의 id입니다.
   */
  async findSeller(id: number): Promise<{ id: number }> {
    const sellerId = await this.prisma.seller.findUnique({
      select: { id: true },
      where: { id },
    });

    if (!sellerId) {
      throw new AuthForbiddenException();
    }
    return sellerId;
  }
}
