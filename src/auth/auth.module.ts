import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { UserModule } from "../user/user.module";
import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "@auth/auth.controller";
import { PassportModule } from "@nestjs/passport";

@Module({
	imports: [
		UserModule,
		PassportModule,
		ConfigModule,
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
	],
	providers: [AuthService, JwtStrategy],
	exports: [AuthService, JwtModule],
	controllers: [AuthController],
})
export class AuthModule {}
