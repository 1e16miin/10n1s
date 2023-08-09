import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

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

	@IsString()
	@ApiProperty({ type: String, description: "소속(회사/학교)" })
	affiliation: string;

	@IsString()
	@ApiProperty({ type: String, description: "직책" })
	position: string;

	@IsString()
	@ApiProperty({ type: String, description: "연락처" })
	contact: string;
}
