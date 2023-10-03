// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { PassportStrategy } from '@nestjs/passport';
// import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
//   constructor(private readonly configService: ConfigService) {
//     super({
//       clientID: configService.get('GOOGLE_CLIENT_ID'),
//       clientSecret: configService.get('GOOGLE_SECRET'),
//       callbackURL:  configService.get('BASE_URL') + '/google/callback',
//       scope: ['email', 'profile'],
//     });
//   }

//   authorizationParams(): { [key: string]: string } {
//     return {
//       access_type: 'offline',
//       prompt: 'consent',
//     };
//   }

//   async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
//     try {
//       const { _json } = profile;
//       const user = {
//         email: _json.email,
//         firstName: _json.family_name,
//         lastName: _json.given_name,
//         photo: _json.picture,
//       };
//       done(null, user);
//     } catch (error) {
//       done(error);
//     }
//   }
// }


import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@auth/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3000/auth/google/callback', // Adjust to your callback URL
      passReqToCallback: true,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _request: any,
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: (error: any, user: any, info?: any) => void,
  ): Promise<any> {
    const user = await this.authService.findOrCreateGoogleUser(profile);
    done(null, user);
  }
}
