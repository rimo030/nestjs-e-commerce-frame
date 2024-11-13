import bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { BuyerGoogleCredentialsRequest } from 'src/interfaces/buyer-google-login.request.interface';
import { BuyerKakaoCredentialsRequest } from 'src/interfaces/buyer-kakao-login.request.interface';
import { BuyerLoginResponse } from 'src/interfaces/buyer-login.response.interface';
import { SellerLoginResponse } from 'src/interfaces/seller-login.response.interface';
import { PrismaService } from 'src/services/prisma.service';
import { NullablePartial } from 'src/types/nullable_partial-type';
import { oauthProviderType } from 'src/types/oauth.provider.type';
import { AuthCredentialsRequestDto } from '../dtos/auth-credentials.request.dto';
import { CreateBuyerRequestDto } from '../dtos/create-buyer.request.dto';
import { CreateSellerRequestDto } from '../dtos/create-seller.dto';
import {
  AuthForbiddenException,
  BuyerRefreshUnauthrizedException,
  BuyerUnauthrizedException,
  OAuthNotFoundException,
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
   */
  async buyerSignUp(createBuyerRequestDto: CreateBuyerRequestDto): Promise<BuyerLoginResponse> {
    const { id } = await this.createBuyer(createBuyerRequestDto);
    const { accessToken, refreshToken } = await this.buyerLogin(id);

    return { id, accessToken, refreshToken };
  }

  /**
   * 판매자 회원가입 기능입니다.
   * seller를 저장합니다. 비밀번호는 암호화 됩니다.
   *
   * @param createSellerDto 저장할 seller의 데이터 입니다.
   */

  async sellerSignUp(createSellerRequestDto: CreateSellerRequestDto): Promise<SellerLoginResponse> {
    const { id } = await this.createSeller(createSellerRequestDto);
    const { accessToken, refreshToken } = await this.sellerLogin(id);

    return { id, accessToken, refreshToken };
  }

  /**
   * buyer의 로그인시 비밀번호가 올바른지 검사합니다.
   * passport의 validate로 호출됩니다.
   *
   * @param authCredentialsDto buyer의 이메일과 비밀번호 입니다.
   */
  async validateBuyer(authCredentialsDto: AuthCredentialsRequestDto): Promise<{ id: number }> {
    const buyer = await this.prisma.buyer.findFirst({
      select: { id: true, password: true },
      where: { email: authCredentialsDto.email, oauthProvider: null },
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
   * buyer의 refresh 토큰이 유효한지 검증한 뒤 새로운 토큰을 발급합니다.
   *
   * @param refreshToken
   */
  async buyerRefresh(refreshToken: string): Promise<BuyerLoginResponse> {
    const { id } = await this.verifyBuyerRefreshToken(refreshToken);
    return await this.buyerLogin(id);
  }

  /**
   * buyer의 구글 로그인을 처리합니다.
   * 등록되지 않은 이메일일 경우 새로 buyer를 생성합니다. 등록된 경우 jwt 토큰을 발행합니다.
   *
   * @param buyerGoogleCredentialsReuqest BuyerGoogleStrategy에서 전달된 정보입니다.
   */
  async buyerGoogleOAuthLogin(
    buyerGoogleCredentialsReuqest: BuyerGoogleCredentialsRequest,
  ): Promise<BuyerLoginResponse> {
    if (!buyerGoogleCredentialsReuqest.id) {
      throw new OAuthNotFoundException();
    }
    return await this.handleGoogleOAuthBuyerLogin(buyerGoogleCredentialsReuqest);
  }

  /**
   * buyer의 카카오 로그인을 처리합니다.
   * 등록되지 않은 이메일일 경우 새로 buyer를 생성합니다. 등록된 경우 jwt 토큰을 발행합니다.
   *
   * @param buyerKakaoCredentialsDto BuyerKakaoStrategy에서 전달된 정보입니다.
   */
  async buyerKakaoOAuthLogin(buyerKakaoCredentialsDto: BuyerKakaoCredentialsRequest): Promise<BuyerLoginResponse> {
    if (!buyerKakaoCredentialsDto.id) {
      throw new OAuthNotFoundException();
    }
    return await this.handleKakaoOAuthBuyerLogin(buyerKakaoCredentialsDto);
  }

  /**
   * seller의 로그인시 비밀번호가 올바른지 검사합니다.
   * passport의 validate로 호출됩니다.
   *
   * @param authCredentialsDto seller의 이메일과 비밀번호 입니다.
   */
  async validateSeller(authCredentialsDto: AuthCredentialsRequestDto): Promise<{ id: number }> {
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
   * seller의 refresh 토큰이 유효한지 검증한 뒤 새로운 토큰을 발급합니다.
   *
   * @param refreshToken
   */
  async sellerRefresh(refreshToken: string): Promise<BuyerLoginResponse> {
    const { id } = await this.verifySellerRefreshToken(refreshToken);
    return await this.buyerLogin(id);
  }

  /**
   * buyer 로그인시 accessToken을 발급합니다.
   * @param id JWT의 페이로드가 될 buyer의 id 입니다.
   */
  async buyerLogin(id: number): Promise<BuyerLoginResponse> {
    const payload: { id: number } = { id };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET_BUYER'),
      expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET_BUYER'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
    });

    return { id, accessToken, refreshToken };
  }

  /**
   * seller 로그인시 accessToken을 발급합니다.
   * @param id JWT의 페이로드가 될 seller의 id 입니다.
   */
  async sellerLogin(id: number): Promise<SellerLoginResponse> {
    const payload: { id: number } = { id };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET_SELLER'),
      expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET_SELLER'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
    });

    return { id, accessToken, refreshToken };
  }

  /**
   * buyer의 이메일이 존재하는지 조회합니다.
   * @param email 조회할 buyer의 이메일 입니다.
   */
  async findBuyerEmail(email: string): Promise<{ id: number }> {
    const buyerId = await this.prisma.buyer.findFirst({
      select: { id: true },
      where: { email, oauthProvider: null },
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

  private async createBuyer(createBuyerRequestDto: CreateBuyerRequestDto): Promise<{ id: number }> {
    const { email, password, name, gender, age, phone } = createBuyerRequestDto;
    const buyer = await this.prisma.buyer.findFirst({ select: { id: true }, where: { email, oauthProvider: null } });
    if (buyer) {
      throw new BuyerUnauthrizedException();
    }

    const hashedPassword = await this.hashPassword(password);

    const buyerId = await this.prisma.buyer.create({
      select: { id: true },
      data: { email, password: hashedPassword, name, gender, age, phone },
    });

    return buyerId;
  }

  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  private async verifyBuyerRefreshToken(refreshToken: string): Promise<{ id: number }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET_BUYER'),
      });
      return payload as { id: number };
    } catch (error) {
      throw new BuyerRefreshUnauthrizedException();
    }
  }

  private async createSeller(createSellerRequestDto: CreateSellerRequestDto): Promise<{ id: number }> {
    const { email, password, name, phone, businessNumber } = createSellerRequestDto;
    const seller = await this.prisma.seller.findUnique({
      select: { id: true },
      where: { email },
    });

    if (seller) {
      throw new SellerUnauthrizedException();
    }

    const hashedPassword = await this.hashPassword(password);

    const sellerId = await this.prisma.seller.create({
      select: { id: true },
      data: { email, password: hashedPassword, name, phone, businessNumber },
    });
    return sellerId;
  }

  private async verifySellerRefreshToken(refreshToken: string): Promise<{ id: number }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET_SELLER'),
      });
      return payload as { id: number };
    } catch (error) {
      throw new SellerEmailNotFoundException();
    }
  }

  private async handleGoogleOAuthBuyerLogin(buyerGoogleCredentialsReuqest: BuyerGoogleCredentialsRequest) {
    const { id, accessToken, refreshToken, email, name } = buyerGoogleCredentialsReuqest;

    const buyer = await this.findOAuthBuyer(id, 'GOOGLE');
    if (!buyer) {
      return await this.createOAuthBuyerAndLogin({ email, name }, id, 'GOOGLE');
    }
    return await this.buyerLogin(buyer.id);
  }

  private async handleKakaoOAuthBuyerLogin(buyerKakaoCredentialsRequest: BuyerKakaoCredentialsRequest) {
    const { id, accessToken, refreshToken, name } = buyerKakaoCredentialsRequest;

    const buyer = await this.findOAuthBuyer(id, 'KAKAO');
    if (!buyer) {
      return await this.createOAuthBuyerAndLogin({ name }, id, 'KAKAO');
    }
    return await this.buyerLogin(buyer.id);
  }

  private async findOAuthBuyer(oauthId: string, oauthProvider: oauthProviderType): Promise<{ id: number } | null> {
    return await this.prisma.buyer.findFirst({
      select: { id: true },
      where: { oauthId, oauthProvider },
    });
  }

  private async createOAuthBuyerAndLogin(
    createBuyerRequestDto: NullablePartial<CreateBuyerRequestDto>,
    oauthId: string,
    oauthProvider: oauthProviderType,
  ): Promise<BuyerLoginResponse> {
    const { email, password, name, gender, age, phone } = createBuyerRequestDto;

    const fallbackName = `${oauthId}_${oauthProvider}`;

    const { id } = await this.prisma.buyer.create({
      select: { id: true },
      data: {
        email: email ?? null,
        password: password ?? null,
        name: name ?? fallbackName,
        gender: gender ?? null,
        age: age ?? null,
        phone: phone ?? null,
        oauthId,
        oauthProvider,
      },
    });

    return await this.buyerLogin(id);
  }
}
