import { Profile, Strategy } from 'passport-kakao';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { BuyerKakaoCredentialsRequest } from 'src/interfaces/buyer-kakao-login.request.interface';

@Injectable()
export class BuyerKakaoStrategy extends PassportStrategy(Strategy, 'buyer-kakao') {
  constructor(readonly configService: ConfigService) {
    super({
      clientID: configService.get('KAKAO_CLIENT_ID'),
      callbackURL: configService.get('KAKAO_CALLBACK_URL'),
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<BuyerKakaoCredentialsRequest> {
    const { id, username } = profile;
    return {
      id: `${id}`,
      accessToken,
      refreshToken,
      name: username,
    };
  }
}
