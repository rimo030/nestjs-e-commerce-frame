import { Body, Controller, HttpCode, Post, UseGuards, Request } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthCredentialsDto } from '../entities/dtos/auth-credentials.dto';
import { CreateBuyerDto } from '../entities/dtos/create-buyer.dto';
import { CreateSellerDto } from '../entities/dtos/create-seller.dto';
import { AuthService } from './auth.service';
import { BuyerLocalAuthGuard } from './guards/buyer-local.auth.guard';
import { SellerLocalAuthGuard } from './guards/seller-local.auth.guard';

@Controller('auth')
@ApiTags('Auth API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(201)
  @Post('/signup')
  @ApiOperation({ summary: 'buyer 생성 API', description: 'buyer를 생성한다.' })
  async buyerSignUp(@Body() createUserDto: CreateBuyerDto): Promise<{ data: { id: number } }> {
    const id = await this.authService.buyerSignUp(createUserDto);
    return { data: id };
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
  async sellerSignUp(@Body() createSellerDto: CreateSellerDto): Promise<{ data: { id: number } }> {
    const id = await this.authService.sellerSignUp(createSellerDto);
    return { data: id };
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
}
