import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from 'src/entities/dtos/auth-credentials.dto';
import { UserId } from './userid.decorator';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AccessToken } from 'src/interfaces/access-token';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 유저 회원가입
  @Post('/signup')
  async signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
    await this.authService.signUp(authCredentialsDto);
  }

  // 유저 로그인
  @Post('/signin')
  async signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<AccessToken> {
    return await this.authService.signIn(authCredentialsDto);
  }

  // 판매자 회원가입
  @Post('/signup-seller')
  async signUpSeller(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
    await this.authService.signUpSeller(authCredentialsDto);
  }

  // 판매자 로그인
  @Post('/signin-seller')
  async signInSeller(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
    await this.authService.signInSeller(authCredentialsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('jwt')
  test1(@UserId() id: number) {
    // 인증이 완료된 user의 id를 반환
    return id;
  }
}
