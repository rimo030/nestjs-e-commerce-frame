import { Profile, Strategy } from 'passport-kakao';
import { v4 } from 'uuid';
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

  /**
   * @todo 카카오 이메일 조회 승인
   */
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<{
    email: string | undefined;
    name: string | undefined;
    accessToken: string;
  }> {
    const { username, _json } = profile;

    return {
      email: _json.kakao_account.email ?? `${v4()}@kakao.com`,
      name: username,
      accessToken,
    };
  }
}
