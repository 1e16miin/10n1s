import { Controller, Post, Body, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Provider } from '@prisma/client';
import { ApiTags, ApiConflictResponse, ApiCreatedResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { OAuth2Client } from 'google-auth-library';
import { Public } from "../common/decorators/skip-auth.decorator";
import { GoogleLoginInputDto } from "./dtos/google-login-auth.dto";
import { AuthToken } from "./dtos/auth-token.dto";



@ApiTags("Auth")
@ApiUnauthorizedResponse({description: '인증이 유효하지 않습니다.'})
@ApiConflictResponse({description: '중복된 이메일로 ', schema: {example: {
  statusCode: 409,
  message: '',
},}})
@Controller('auth')	//컨트롤러 데코레이터
export class AuthController {	//클래스이름
  constructor(	//컨스트럭터로 초기값설정
    private readonly authService: AuthService
  ) {}

  @ApiCreatedResponse({description: "구글 인증 성공. 최초 로그인시 회원가입이 되며 AccessToken 발행. 이후 로그인 시에는 AccessToken만 발행", type: AuthToken})
  @Public()
  @Post('google/token')
  async handleGoogleToken(@Body() {googleAccessToken}:GoogleLoginInputDto) {
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
          throw new UnauthorizedException('토큰이 유효하지 않습니다.');
      }
  }
}

