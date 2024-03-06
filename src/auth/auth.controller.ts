import { Body, Controller, HttpCode, Post, UseGuards, Request } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCommonDto } from './dto/auth.common.dto';
import { CreateBuyerDto } from './dto/create.buyer.dto';
import { CreateSellerDto } from './dto/create.seller.dto';
import { BuyerLocalAuthGuard } from './guards/buyer.local.auth.guard';
import { SellerLocalAuthGuard } from './guards/seller.local.auth.guard';

@Controller('auth')
@ApiTags('Auth API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(201)
  @Post('/signup')
  @ApiOperation({ summary: 'buyer 생성 API', description: 'buyer를 생성한다.' })
  async buyerSignUp(@Body() createUserDto: CreateBuyerDto): Promise<void> {
    await this.authService.buyerSignUp(createUserDto);
  }

  @UseGuards(BuyerLocalAuthGuard)
  @HttpCode(201)
  @Post('/signin')
  @ApiOperation({ summary: 'buyer 로그인 API', description: 'buyer 비밀번호 매칭' })
  buyerSignIn(@Body() authCredentialsDto: AuthCommonDto, @Request() req): Promise<{ accessToken: string }> {
    return this.authService.buyerLogin(req.user.id);
  }

  @HttpCode(201)
  @Post('/signup-seller')
  @ApiOperation({ summary: 'seller 생성 API', description: 'seller 생성한다.' })
  async sellerSignUp(@Body() createSellerDto: CreateSellerDto): Promise<void> {
    await this.authService.sellerSignUp(createSellerDto);
  }

  @UseGuards(SellerLocalAuthGuard)
  @HttpCode(201)
  @Post('/signin-seller')
  @ApiOperation({ summary: 'seller 로그인 API', description: 'seller 비밀번호 매칭' })
  sellerSignIn(@Body() authCredentialsDto: AuthCommonDto, @Request() req): Promise<{ accessToken: string }> {
    return this.authService.sellerLogin(req.user.id);
  }
}
