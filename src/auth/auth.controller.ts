import { Controller, Get, Req, Res, UseGuards, Post, Body } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { UserService } from "@user/user.service";
import { AuthService } from "./auth.service";
import { Provider } from '@prisma/client';
import {
	ApiBadRequestResponse,
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from "@nestjs/swagger";

import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from "@nestjs/config";
import { GoogleLoginInputDto } from "./dtos/google-login-auth.dto";

interface IOAuthUser {	//interface 설정
  user: {
    name: string;
    email: string;
    password: string;
  };
}

@ApiTags("Auth")
@Controller('auth')	//컨트롤러 데코레이터
export class AuthController {	//클래스이름
  constructor(	//컨스트럭터로 초기값설정
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Post('google/token')
  async handleGoogleToken(@Body() {googleAccessToken}:GoogleLoginInputDto) {
      // Validate the token with Google's API
      // Ensure secure transmission (HTTPS) and perform token validation
      
      // Example: Validate token using a library like `google-auth-library`
      const clientId = process.env.GOOGLE_CLIENT_ID
      const client = new OAuth2Client(clientId);
      
      try {
          const ticket = await client.verifyIdToken({
              idToken: googleAccessToken,
              audience: clientId,
          });
          
          const {email, name} = ticket.getPayload();
          const googleUser = {email: email, nickname: name, provider: Provider.GOOGLE}
          return await this.authService.socialLogin(googleUser)
      } catch (error) {
          console.error('Error verifying Google token:', error);
          throw new Error('Invalid token');
      }
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
