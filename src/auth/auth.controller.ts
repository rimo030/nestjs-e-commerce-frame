import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from 'src/entities/dtos/auth-credentials.dto';
import { UserId } from './userid.decorator';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AccessToken } from 'src/interfaces/access-token';
import { BuyerLocalAuthGuard } from './guards/buyer-local.auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { SellerLocalAuthGuard } from './guards/seller-local.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // buyer 회원가입
  @Post('/signup')
  async buyerSignUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
    await this.authService.buyerSignUp(authCredentialsDto);
  }

  // buyer 로그인 (토큰 발행)
  @UseGuards(BuyerLocalAuthGuard)
  @Post('/signin')
  buyerSignIn(@Req() req) {
    return this.authService.login(req.user);
  }

  // 판매자 회원가입
  @Post('/signup-seller')
  async sellerSignUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
    await this.authService.sellerSignUp(authCredentialsDto);
  }

  // 판매자 로그인
  @UseGuards(SellerLocalAuthGuard)
  @Post('/signin-seller')
  sellerSignIn(@Req() req) {
    return this.authService.login(req.user);
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('jwt')
  // test1(@UserId() id: number) {
  //   // 인증이 완료된 user의 id를 반환
  //   return id;
  // }
}
