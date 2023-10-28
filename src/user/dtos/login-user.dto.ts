import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginUserDto {
  @IsString()
  @ApiProperty({ type: String, description: "유저 email" })
  email!: string;

  @IsString()
  @ApiProperty({ type: String, description: "유저 password" })
  password!: string;
}
