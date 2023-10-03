import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { GoogleRequest } from '@auth/auth.interface';
import { GoogleLoginAuthOutputDto } from '@auth/dtos/google-login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { ConfigService } from "@nestjs/config";
import { UserService } from "@user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async findOrCreateGoogleUser(profile: any){

  }

  async findOrCreateAppleUser(profile: any){
    
  }

  async login(user: any) {

    // return {accessToken: }
  }
  
}
