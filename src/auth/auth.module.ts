import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthEntity } from "./entities/auth.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtRefreshStrategy } from "./strategies/jwt-refresh.strategy";
import { UserModule } from "../user/user.module";
import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PassportModule } from "@nestjs/passport";

@Module({
	imports: [
		UserModule,
		PassportModule,
		ConfigModule,
		TypeOrmModule.forFeature([AuthEntity]),
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
	providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
	exports: [AuthService, JwtModule],
	controllers: [AuthController],
})
export class AuthModule {}
