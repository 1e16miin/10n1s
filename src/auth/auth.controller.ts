import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Put,
	Req,
	Res,
	UseFilters,
	UseGuards,
} from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";

import { Public } from "../common/decorators/skip-auth.decorator";

import { LoginUserDto } from "./../user/dto/login-user.dto";
import { AuthService } from "./auth.service";
import { ConfirmVerifyCodeDto, SendEmailDto } from "./dto/email-auth.dto";
import { JwtRefreshGuard } from "./guards/jwt-refresh.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@ApiTags("Auth")
@ApiBadRequestResponse({
	description: "요청 parameter 오류",
	schema: {
		example: {
			message: "Bad Request",
		},
	},
})
@ApiInternalServerErrorResponse({
	description: "서버 내부 오류",
	schema: {
		example: {
			message: "Internal Server Error",
		},
	},
})
@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}
	@ApiCreatedResponse({
		description: "이메일 발송 성공",
		schema: {
			example: "success",
		},
	})
	@ApiOperation({
		summary: "인증코드 이메일 발송",
		description: "이메일 인증을 시도한 유저의 email에 인증코드 이메일 발송",
	})
	@Public()
	@Post("verify-email")
	async sendVerifyEmail(@Body() sendEmailDto: SendEmailDto) {
		await this.authService.signUpAuth(sendEmailDto);
		return "success";
	}

	@ApiCreatedResponse({
		description: "인증성공",
		schema: {
			example: "success",
		},
	})
	@ApiForbiddenResponse({
		description: "시간초과 | 인증 코드 불일치",
		schema: {
			example: {
				message: "제한 시간이 초과되었습니다. | 인증코드가 일치하지 않습니다.",
			},
		},
	})
	@ApiNotFoundResponse({
		description: "db에 존재하지 않는 email",
		schema: {
			example: {
				message: "인증 이메일을 재요청 해주세요.",
			},
		},
	})
	@ApiConflictResponse({
		description: "(회원가입 시에만)중복된 이메일",
		schema: {
			example: {
				message: "이미 가입된 이메일 입니다.",
			},
		},
	})
	@ApiOperation({
		summary: "인증코드 확인 API",
		description: "이메일로 수신한 인증코드의 유효성 검증",
	})
	@Public()
	@Post("confirm")
	async confirmVerifyCode(@Body() confirmVerifyCodeDto: ConfirmVerifyCodeDto) {
		await this.authService.confirmVerifyCode(confirmVerifyCodeDto);
		return "success";
	}

	@ApiBadRequestResponse({
		description: "email이나 password 불일치",
		schema: {
			example: {
				message: "사용자 정보가 일치하지 않습니다",
			},
		},
	})
	@ApiForbiddenResponse({
		description: "db에 존재하지 않는 email",
		schema: {
			example: {
				message: "등록되지 않은 사용자입니다.",
			},
		},
	})
	@ApiOperation({
		summary: "로그인 API",
		description:
			"로그인 성공시 cookie 헤더에 Authorization으로 accessToken과 Refresh로 RefreshToken이 발급됨",
	})
	@ApiOkResponse({
		description: "로그인 성공",
		schema: {
			example: {
				id: 6,
				email: "ddogi1513@gmail.com",
				name: "박경민",
				affiliation: "유어라운드",
				position: "인턴",
				contact: "01051795955",
			},
		},
	})
	@HttpCode(200)
	@UseGuards(LocalAuthGuard)
	@Public()
	@Post("login")
	async login(
		@Req() req: any,
		@Body() loginUserDto: LoginUserDto,
		@Res({ passthrough: true }) res
	) {
		const { id, ...user } = req.user;
		const { accessToken, ...accessOption } =
			this.authService.getCookieWithJwtAccessToken(id);

		const { refreshToken, ...refreshOption } =
			await this.authService.getCookieWithJwtRefreshToken(id);

		res.cookie("Authentication", accessToken, accessOption);
		res.cookie("Refresh", refreshToken, refreshOption);
		return user;
	}

	@ApiOperation({
		summary: "AccessToken 재발급 API",
		description:
			"RefreshToken을 통해 cookie 헤더에 Authorization으로 accessToken 발급",
	})
	@ApiOkResponse({
		description: "accessToken 재발급 성공",
		schema: {
			example: "success",
		},
	})
	@UseGuards(JwtRefreshGuard)
	@Public()
	@Get("refresh")
	refresh(@Req() req: any, @Res({ passthrough: true }) res) {
		const user = req.user;
		const { accessToken, ...accessOption } =
			this.authService.getCookieWithJwtAccessToken(user.id);
		res.cookie("Authentication", accessToken, accessOption);
		return accessToken;
	}

	@ApiOperation({
		summary: "로그아웃 API",
		description: "로그아웃",
	})
	@ApiOkResponse({
		description: "로그아웃 성공",
		schema: {
			example: "success",
		},
	})
	@Public()
	@HttpCode(200)
	@Post("logout")
	async logOut(@Req() req: any, @Res({ passthrough: true }) res) {
		const { accessOption, refreshOption } =
			this.authService.getCookiesForLogOut();
		res.clearCookie("Authentication", accessOption);
		res.clearCookie("Refresh", refreshOption);
		return "success";
	}

	@ApiOperation({
		summary: "비밀번호 변경 링크 이메일 발송 API",
		description:
			"비밀번호 변경가능 인증 이메일 발송, 암호화된 url을 풀면 {email: email, verifyCode: verifyCode} 객체가 나옴",
	})
	@ApiCreatedResponse({
		description: "이메일 발송 성공",
		schema: {
			example: "success",
		},
	})
	@ApiForbiddenResponse({
		description: "db에 존재하지 않는 email",
		schema: {
			example: {
				message: `등록되지 않은 사용자입니다.`,
			},
		},
	})
	@Public()
	@Post("find/password")
	async findPassword(@Body() sendEmailDto: SendEmailDto) {
		await this.authService.findPassword(sendEmailDto.receiverEmail);
		return "success";
	}

	@ApiOperation({
		summary: "비밀번호 변경 API",
		description: "이메일 내 링크를 통해 비밀번호 변경",
	})
	@ApiForbiddenResponse({
		description: "이메일에서 링크 클릭했을 때 유효하지 않은 경우",
		schema: {
			example: {
				message: `인증되지 않은 이메일입니다.`,
			},
		},
	})
	@ApiCreatedResponse({
		description: "비밀번호 변경성공",
		schema: {
			example: "success",
		},
	})
	@HttpCode(201)
	@Public()
	@Put("change/password")
	async changePassword(@Body() loginUserDto: LoginUserDto) {
		await this.authService.resetPassword(
			loginUserDto.email,
			loginUserDto.password
		);
		return "success";
	}
}
