import { Body, Controller, HttpCode, Post, UseGuards, Request, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthCredentialsDto } from '../dtos/auth-credentials.dto';
import { CreateBuyerDto } from '../dtos/create-buyer.dto';
import { CreateSellerDto } from '../dtos/create-seller.dto';
import { AuthService } from './auth.service';
import { BuyerGoogleOAuthGuard } from './guards/buyer-google-oauth.guard';
import { BuyerKakaoOAuthGuard } from './guards/buyer-kakao-oauth.guard';
import { BuyerLocalAuthGuard } from './guards/buyer-local.auth.guard';
import { SellerLocalAuthGuard } from './guards/seller-local.auth.guard';
import { BuyerLoginDto } from 'src/dtos/login-buyer.dto';
import { UserId } from 'src/decorators/user-id.decorator';
import { CommonResponse } from 'src/interfaces/common-response.interface';

@Controller('auth')
@ApiTags('Auth API')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(201)
  @Post('/signup')
  @ApiOperation({ summary: 'buyer 생성 API', description: 'buyer 회원가입 기능' })
  async buyerSignUp(@Body() createUserDto: CreateBuyerDto): Promise<CommonResponse<BuyerLoginDto>> {
    const data = await this.authService.buyerSignUp(createUserDto)
    return { data, message: "회원가입이 완료 되었습니다." };
  }

  @UseGuards(BuyerLocalAuthGuard)
  @HttpCode(201)
  @Post('/signin')
  @ApiOperation({ summary: 'buyer 로그인 API', description: 'buyer 로그인 기능' })
  async buyerSignIn(
    @UserId() buyerId: number,
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<CommonResponse<BuyerLoginDto>> {
    const data = await this.authService.buyerLogin(buyerId)
    return { data, message: "로그인 되었습니다." };
  }

  @HttpCode(201)
  @Post('/refresh')
  @ApiOperation({ summary: 'buyer Refresh API', description: 'buyer 액세트 토큰 갱신 기능' })
  async buyerRefresh(@Body() { refreshToken }: { refreshToken: string }): Promise<CommonResponse<BuyerLoginDto>> {
    const data = await this.authService.buyerRefresh(refreshToken)
    return { data };
  }

  @HttpCode(201)
  @Post('/signup-seller')
  @ApiOperation({ summary: 'seller 생성 API', description: 'seller 생성한다.' })
  async sellerSignUp(@Body() createSellerDto: CreateSellerDto): Promise<{ data: { id: number; accessToken: string } }> {
    const { id } = await this.authService.sellerSignUp(createSellerDto);
    const { accessToken } = await this.authService.sellerLogin(id);
    return { data: { id, accessToken } };
  }

  @UseGuards(SellerLocalAuthGuard)
  @HttpCode(201)
  @Post('/signin-seller')
  @ApiOperation({ summary: 'seller 로그인 API', description: 'seller 비밀번호 매칭' })
  async sellerSignIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
    @Request() req,
  ): Promise<{ data: { accessToken: string } }> {
    const accessToken = await this.authService.sellerLogin(req.user.id);
    return { data: accessToken };
  }

  @Get('google')
  @UseGuards(BuyerGoogleOAuthGuard)
  async googleAuth() { }

  @Get('google/callback')
  @UseGuards(BuyerGoogleOAuthGuard)
  async googleAuthRedirect(@Request() req) {
    const accessToken = await this.authService.buyerGoogleOAuthLogin(req.user);
    return { data: accessToken };
  }

  @Get('kakao')
  @UseGuards(BuyerKakaoOAuthGuard)
  async kakaoAuth() { }

  @Get('kakao/callback')
  @UseGuards(BuyerKakaoOAuthGuard)
  async kakaoAuthCallback(@Request() req): Promise<{ data: { accessToken: string } }> {
    const accessToken = await this.authService.buyerKakaoOAuthLogin(req.user);
    return { data: accessToken };
  }
}
