import { Body, Controller, HttpCode, Post, UseGuards, Request, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserId } from 'src/decorators/user-id.decorator';
import { BuyerLoginResponse } from 'src/interfaces/buyer-login.response.interface';
import { CommonResponse } from 'src/interfaces/common-response.interface';
import { SellerLoginResponse } from 'src/interfaces/seller-login.response.interface';
import { AuthCredentialsRequestDto } from '../dtos/auth-credentials.request.dto';
import { CreateBuyerRequestDto } from '../dtos/create-buyer.dto';
import { CreateSellerRequestDto } from '../dtos/create-seller.dto';
import { AuthService } from './auth.service';
import { BuyerGoogleOAuthGuard } from './guards/buyer-google-oauth.guard';
import { BuyerKakaoOAuthGuard } from './guards/buyer-kakao-oauth.guard';
import { BuyerLocalAuthGuard } from './guards/buyer-local.auth.guard';
import { SellerLocalAuthGuard } from './guards/seller-local.auth.guard';

@Controller('auth')
@ApiTags('Auth API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(201)
  @Post('/signup')
  @ApiOperation({ summary: 'buyer 생성 API', description: 'buyer 회원가입 기능' })
  async buyerSignUp(@Body() createBuyerRequestDto: CreateBuyerRequestDto): Promise<CommonResponse<BuyerLoginResponse>> {
    const data = await this.authService.buyerSignUp(createBuyerRequestDto);
    return { data, message: '회원가입이 완료 되었습니다.' };
  }

  @UseGuards(BuyerLocalAuthGuard)
  @HttpCode(201)
  @Post('/signin')
  @ApiOperation({ summary: 'buyer 로그인 API', description: 'buyer 로그인 기능' })
  async buyerSignIn(
    @UserId() buyerId: number,
    @Body() authCredentialsRequestDto: AuthCredentialsRequestDto,
  ): Promise<CommonResponse<BuyerLoginResponse>> {
    const data = await this.authService.buyerLogin(buyerId);
    return { data, message: '로그인 되었습니다.' };
  }

  @HttpCode(201)
  @Post('/refresh')
  @ApiOperation({ summary: 'buyer Refresh API', description: 'buyer 액세스 토큰 갱신 기능' })
  async buyerRefresh(@Body() { refreshToken }: { refreshToken: string }): Promise<CommonResponse<BuyerLoginResponse>> {
    const data = await this.authService.buyerRefresh(refreshToken);
    return { data };
  }

  @HttpCode(201)
  @Post('/signup-seller')
  @ApiOperation({ summary: 'seller 생성 API', description: 'seller 회원가입 기능' })
  async sellerSignUp(
    @Body() createBuyerRequestDto: CreateSellerRequestDto,
  ): Promise<CommonResponse<SellerLoginResponse>> {
    const data = await this.authService.sellerSignUp(createBuyerRequestDto);
    return { data, message: '회원가입이 완료 되었습니다.' };
  }

  @UseGuards(SellerLocalAuthGuard)
  @HttpCode(201)
  @Post('/signin-seller')
  @ApiOperation({ summary: 'seller 로그인 API', description: 'seller 비밀번호 매칭' })
  async sellerSignIn(
    @UserId() sellerId: number,
    @Body() authCredentialsRequestDto: AuthCredentialsRequestDto,
  ): Promise<CommonResponse<SellerLoginResponse>> {
    const data = await this.authService.sellerLogin(sellerId);
    return { data, message: '로그인 되었습니다.' };
  }

  @HttpCode(201)
  @Post('/refresh-seller')
  @ApiOperation({ summary: 'seller Refresh API', description: 'seller 액세스 토큰 갱신 기능' })
  async sellerRefresh(
    @Body() { refreshToken }: { refreshToken: string },
  ): Promise<CommonResponse<SellerLoginResponse>> {
    const data = await this.authService.sellerRefresh(refreshToken);
    return { data };
  }

  @Get('google')
  @UseGuards(BuyerGoogleOAuthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(BuyerGoogleOAuthGuard)
  async googleAuthRedirect(@Request() req) {
    const accessToken = await this.authService.buyerGoogleOAuthLogin(req.user);
    return { data: accessToken };
  }

  @Get('kakao')
  @UseGuards(BuyerKakaoOAuthGuard)
  async kakaoAuth() {}

  @Get('kakao/callback')
  @UseGuards(BuyerKakaoOAuthGuard)
  async kakaoAuthCallback(@Request() req): Promise<{ data: { accessToken: string } }> {
    const accessToken = await this.authService.buyerKakaoOAuthLogin(req.user);
    return { data: accessToken };
  }
}
