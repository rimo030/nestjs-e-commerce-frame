import { Profile, Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class BuyerGoogleStrategy extends PassportStrategy(Strategy, 'buyer-google') {
  constructor(readonly configService: ConfigService) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<{
    email: string | undefined;
    name: string | undefined;
    accessToken: string;
  }> {
    const { emails, name } = profile;
    return {
      email: emails ? emails[0].value : emails,
      name: name?.givenName,
      accessToken,
    };
  }
}
