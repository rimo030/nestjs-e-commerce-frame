import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthCredentialsDto } from 'src/entities/dtos/auth-credentials.dto';
import { CreateBuyerDto } from 'src/entities/dtos/create-buyer.dto';
import { CreateSellerDto } from 'src/entities/dtos/create-seller.dto';
import { AuthService } from './auth.service';
import { BuyerLocalAuthGuard } from './guards/buyer-local.auth.guard';
import { BuyerJwtAuthGuard } from './guards/buyer.jwt.guard';
import { SellerLocalAuthGuard } from './guards/seller-local.auth.guard';
import { UserId } from './userid.decorator';

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
  buyerSignIn(@Body() authCredentialsDto: AuthCredentialsDto, @UserId() buyerId: number) {
    return this.authService.buyerLogin(buyerId);
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
  sellerSignIn(@Body() authCredentialsDto: AuthCredentialsDto, @UserId() sellerId: number) {
    return this.authService.sellrLogin(sellerId);
  }

  @UseGuards(BuyerJwtAuthGuard)
  @Get('/mypage')
  getMyPage(@UserId() buyerId: number) {
    return buyerId;
  }
}
