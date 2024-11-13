import { Profile, Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { BuyerGoogleCredentialsRequest } from 'src/interfaces/buyer-google-login.request.interface';

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

  async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<BuyerGoogleCredentialsRequest> {
    const { id, emails, name } = profile;
    return {
      id,
      accessToken,
      refreshToken,
      name: name?.givenName,
      email: emails ? emails[0].value : emails,
    };
  }
}
