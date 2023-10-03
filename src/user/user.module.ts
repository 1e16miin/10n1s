import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { APP_GUARD } from "@nestjs/core";
import { UserRepository } from "./user.repository";

@Module({
	imports: [
		ConfigModule
	],
	providers: [UserService, UserRepository],
	controllers: [UserController],
	exports: [UserService],
})
export class UserModule {}
