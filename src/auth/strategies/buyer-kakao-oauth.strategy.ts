import { Profile, Strategy } from 'passport-kakao';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class BuyerKakaoStrategy extends PassportStrategy(Strategy, 'buyer-kakao') {
  constructor(readonly configService: ConfigService) {
    super({
      clientID: configService.get('KAKAO_CLIENT_ID'),
      callbackURL: configService.get('KAKAO_CALLBACK_URL'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<{
    kakaoId: string | undefined;
    name: string | undefined;
    accessToken: string;
  }> {
    const { id, username } = profile;

    return {
      kakaoId: id,
      name: username,
      accessToken,
    };
  }
}
