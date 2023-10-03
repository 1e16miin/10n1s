import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req: any, @Res() res: any) {
    const token = await this.authService.login(req.user);
    // Implement your logic to redirect or return the JWT token as needed.
  }

  @Get('apple')
  @UseGuards(AuthGuard('apple'))
  async appleLogin() {}

  @Get('apple/callback')
  @UseGuards(AuthGuard('apple'))
  async appleLoginCallback(@Req() req: any, @Res() res: any) {
    const token = await this.authService.login(req.user);
    // Implement your logic to redirect or return the JWT token as needed.
  }
}
