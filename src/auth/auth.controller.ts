import { Body, Controller, HttpCode, Post, UseGuards, Request, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthCredentialsDto } from '../dtos/auth-credentials.dto';
import { CreateBuyerDto } from '../dtos/create-buyer.dto';
import { CreateSellerDto } from '../dtos/create-seller.dto';
import { AuthService } from './auth.service';
import { BuyerGoogleOAuthGuard } from './guards/buyer-google-oauth.guard';
import { BuyerLocalAuthGuard } from './guards/buyer-local.auth.guard';
import { SellerLocalAuthGuard } from './guards/seller-local.auth.guard';

@Controller('auth')
@ApiTags('Auth API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(201)
  @Post('/signup')
  @ApiOperation({ summary: 'buyer 생성 API', description: 'buyer를 생성한다.' })
  async buyerSignUp(@Body() createUserDto: CreateBuyerDto): Promise<{ data: { id: number; accessToken: string } }> {
    const { id } = await this.authService.buyerSignUp(createUserDto);
    const { accessToken } = await this.authService.buyerLogin(id);
    return { data: { id, accessToken } };
  }

  @UseGuards(BuyerLocalAuthGuard)
  @HttpCode(201)
  @Post('/signin')
  @ApiOperation({ summary: 'buyer 로그인 API', description: 'buyer 비밀번호 매칭' })
  async buyerSignIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
    @Request() req,
  ): Promise<{ data: { accessToken: string } }> {
    const accessToken = await this.authService.buyerLogin(req.user.id);
    return { data: accessToken };
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
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(BuyerGoogleOAuthGuard)
  async googleAuthRedirect(@Request() req) {
    const accessToken = await this.authService.buyerGoogleOAuthLogin(req.user);
    return { data: accessToken };
  }
}
