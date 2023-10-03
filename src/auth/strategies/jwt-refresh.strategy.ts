// import { ConfigService } from "@nestjs/config";
// import { Injectable } from "@nestjs/common";
// import { PassportStrategy } from "@nestjs/passport";
// import { ExtractJwt, Strategy } from "passport-jwt";
// import { UserService } from "@user/user.service";

// @Injectable()
// export class JwtRefreshStrategy extends PassportStrategy(
// 	Strategy,
// 	"jwt-refresh-token"
// ) {
// 	constructor(
// 		private readonly userService: UserService,
// 		private readonly configService: ConfigService
// 	) {
// 		super({
// 			jwtFromRequest: ExtractJwt.fromExtractors([
// 				(request) => {
// 					console.log(request);
// 					return request?.cookies?.Refresh;
// 				},
// 			]),
// 			secretOrKey: configService.get("JWT_SECRET_KEY"),
// 			passReqToCallback: true,
// 		});
// 	}

// 	async validate(req: any, payload: any) {
// 		const refreshToken = req.cookies?.Refresh;
// 		return this.userService.getUserIfRefreshTokenMatches(
// 			refreshToken,
// 			payload.id
// 		);
// 	}
// }
