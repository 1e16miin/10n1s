import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { UserService } from "@user/user.service";
import { AuthService } from "./auth.service";

interface IOAuthUser {	//interface 설정
  user: {
    name: string;
    email: string;
    password: string;
  };
}

@Controller('auth')	//컨트롤러 데코레이터
export class AuthController {	//클래스이름
  constructor(	//컨스트럭터로 초기값설정
    private readonly authService: AuthService
  ) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get("/google/callback")
  @UseGuards(AuthGuard("google"))
	async googleLoginCallBack(
    @Req() req: Request,
    @Res() res: Response
  ) {
    res.send(await this.authService.socialLogin(req.user));
  }
 
  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  naverLogin() {}

  @Get('naver/callback')
  @UseGuards(AuthGuard('naver'))
  async naverLoginCallback(@Req() req: Request, @Res() res: Response	) {
    res.send(await this.authService.socialLogin(req.user));
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  kakaoLogin() {}

  @Get('naver/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLoginCallback( @Req() req: Request, @Res() res: Response	) {
    res.send(await this.authService.socialLogin(req.user));
  }
}
