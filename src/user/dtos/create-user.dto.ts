import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsString } from "class-validator";
import { Provider } from "@prisma/client";

export class CreateUserDto {
	@IsEmail()
	@ApiProperty({ type: String, description: "유저 email" })
	email: string;

	@IsString()
	@ApiProperty({ type: String, description: "유저 name" })
	name: string;

	@IsString()
	@ApiProperty({ type: String, description: "유저 Password" })
	password: string;

	@IsEnum(Provider)
	provider: Provider;

	@IsString()
	refreshToken: string;
}
