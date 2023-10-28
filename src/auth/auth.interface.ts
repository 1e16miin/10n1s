import { Request } from 'express';

// import { ValidateAuthOutputDto } from '@auth/dtos/validate-auth.dto';

// export type RequestWithUser = Request & { user: ValidateAuthOutputDto };

/* Google Strategy */
type GoogleUser = {
    email: string;
    firstName: string;
    lastName: string;
    photo: string;
  };
  
export type GoogleRequest = Request & { user: GoogleUser };

/* Kakao Strategy */
type KakaoUser = {
    email: string;
    nickname: string;
    photo: string;
  };
  
export type KakaoRequest = Request & { user: KakaoUser };

type NaverUser = {
    email: string;
    nickname: string;
    photo: string;
}

export type NaverRequest = Request & { user: NaverUser };
