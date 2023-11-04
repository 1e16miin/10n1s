
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback, Profile } from "passport-google-oauth20";

export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'), 
      callbackURL: configService.get('BASE_URL') + "/auth/google/callback",
      scope: ["email", "profile"],
      passReqToCallback: true
    });
  }

  async validate (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any> {
    const { displayName, emails, photos, provider } = profile
    const user = {
      email: emails[0].value,
      nickname: displayName,
      photo: photos[0].value,
      provider: provider
    }
    done(null, user);
  }
}
