import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from '@nestjs/config';
import { Profile, Strategy } from "passport-naver";
import { Injectable } from '@nestjs/common';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
        clientID: configService.get('NAVER_CLIENT_ID'),
        clientSecret: '',
        callbackURL: configService.get('BASE_URL') + 'naver/callback',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void,
  ) {
    try {
      const { _json } = profile;
      const user = {
        email: _json.email,
        nickname: _json.nickname,
        photo: _json.profile_image,
      };
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
};
