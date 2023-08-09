import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsInt, IsNumber, IsString, Max, Min } from "class-validator";

export class SendEmailDto {
	@IsEmail()
	@ApiProperty({ type: String, description: "유저 email" })
	receiverEmail!: string;

	@IsNumber()
	@ApiProperty({ description: "이메일 종류, 0:회원가입 1:데모" })
	type: number;
}

export class ConfirmVerifyCodeDto {
	@IsEmail()
	@ApiProperty({ type: String, description: "유저 email" })
	email!: string;

	@IsString()
	@ApiProperty({ type: String, description: "인증 번호" })
	verifyCode!: string;

	@IsInt()
	@Max(2)
	@Min(0)
	@ApiProperty({
		type: Number,
		description: "인증 종류, 0:회원가입, 1:비밀번호 변경, 2:데모",
	})
	type!: number;
}
