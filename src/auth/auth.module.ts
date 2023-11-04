import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "@auth/auth.controller";
import { UserModule } from "@user/user.module";
import { GoogleStrategy } from "./strategies/google.strategy";
import { NaverStrategy } from "./strategies/naver.strategy";
import { KakaoStrategy } from "./strategies/kakao.strategy";

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get("JWT_SECRET_KEY"),
				signOptions: {
					expiresIn: `${configService.get("ACCESS_TOKEN_EXPIRE_TIME")}s`,
				},
			}),
		}),
		UserModule
	],
	providers: [AuthService, JwtStrategy, GoogleStrategy, NaverStrategy, KakaoStrategy],
	exports: [AuthService, JwtModule],
	controllers: [AuthController],
})
export class AuthModule {}
