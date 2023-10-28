import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UserController } from "@user/user.controller";
import { UserService } from "@user/user.service";
import { UserRepository } from "@user/user.repository";

@Module({
	imports: [
		ConfigModule
	],
	providers: [UserService, UserRepository],
	controllers: [UserController],
	exports: [UserService],
})
export class UserModule {}
