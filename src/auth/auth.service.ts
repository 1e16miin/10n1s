import { ConflictException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "@user/user.service";
// import {
//   IAuthServiceGetAccessToken,
//   IAuthServiceSetRefreshToken,
// } from "./interfaces/auth-service.interface";

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  // setAccessToken({user, res}){
    
  // }

  // setRefreshToken({user, res}){

  // }
  
  async socialLogin(socialUser: any) {
    let user = await this.userService.findByEmail(socialUser.email);

    if (user){
      if (user.provider !== socialUser.provider) {
        throw new ConflictException('이미 존재하는 이메일 입니다.')
      }
    } else {
      user = await this.userService.create({ ...socialUser })
    }

    const payload = {sub: user.id, email: user.email}

    return {accessToken: this.jwtService.sign(payload)};
  }
}
