import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from 'src/entities/dtos/auth-credentials.dto';
import { UserId } from './userid.decorator';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AccessToken } from 'src/interfaces/access-token';
import { BuyerLocalAuthGuard } from './guards/local-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // buyer 회원가입
  @Post('/signup')
  async signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
    await this.authService.signUp(authCredentialsDto);
  }

  // buyer 로그인 (토큰 발행)
  @UseGuards(BuyerLocalAuthGuard)
  @Post('/signin')
  signIn(@Req() req) {
    return this.authService.login(req.user);
  }

  // 판매자 회원가입
  @Post('/signup-seller')
  async signUpSeller(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
    await this.authService.signUpSeller(authCredentialsDto);
  }

  // 판매자 로그인
  // @Post('/signin-seller')
  // async signInSeller(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
  //   await this.authService.signInSeller(authCredentialsDto);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Post('jwt')
  // test1(@UserId() id: number) {
  //   // 인증이 완료된 user의 id를 반환
  //   return id;
  // }
}
