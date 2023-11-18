import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateBuyerDto } from 'src/entities/dtos/create-buyer.dto';
import { CreateSellerDto } from 'src/entities/dtos/create-seller.dto';
import { AccessToken } from 'src/interfaces/access-token';
import { BuyerAuthResult } from 'src/interfaces/buyer-auth-result';
import { Payload } from 'src/interfaces/payload';
import { SellerAuthResult } from 'src/interfaces/seller-auth-result';
import { AuthService } from './auth.service';
import { BuyerLocalAuthGuard } from './guards/buyer-local.auth.guard';
import { BuyerJwtAuthGuard } from './guards/buyer.jwt.guard';
import { SellerLocalAuthGuard } from './guards/seller-local.auth.guard';
import { SellerJwtAuthGuard } from './guards/seller.jwt.guard';
import { User } from './user.decorator';

@Controller('auth')
@ApiTags('로그인 API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // buyer 회원가입
  @Post('/signup')
  @ApiOperation({ summary: 'buyer 생성 API', description: 'buyer를 생성한다.' })
  async buyerSignUp(@Body() createUserDto: CreateBuyerDto): Promise<void> {
    await this.authService.buyerSignUp(createUserDto);
  }

  // buyer 로그인 (토큰 발행)
  @UseGuards(BuyerLocalAuthGuard)
  @Post('/signin')
  @ApiOperation({ summary: 'buyer 로그인 API', description: 'buyer 비밀번호 매칭' })
  buyerSignIn(@User() user: BuyerAuthResult) {
    return this.authService.buyerLogin(user);
  }

  // 판매자 회원가입
  @Post('/signup-seller')
  @ApiOperation({ summary: 'seller 생성 API', description: 'seller 생성한다.' })
  async sellerSignUp(@Body() createSellerDto: CreateSellerDto): Promise<void> {
    await this.authService.sellerSignUp(createSellerDto);
  }

  // 판매자 로그인
  @UseGuards(SellerLocalAuthGuard)
  @Post('/signin-seller')
  @ApiOperation({ summary: 'seller 로그인 API', description: 'seller 비밀번호 매칭' })
  sellerSignIn(@User() user: SellerAuthResult) {
    return this.authService.sellrLogin(user);
  }

  @UseGuards(BuyerJwtAuthGuard)
  @Get('/mypage')
  getMyPage(@User() user: BuyerAuthResult) {
    return user;
  }

  @UseGuards(SellerJwtAuthGuard)
  @Get('/seller-page')
  getSellerPage(@User() user: SellerAuthResult) {
    return user;
  }
}
