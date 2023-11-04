import { Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_PIPE } from "@nestjs/core";
import * as Joi from "joi";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "@auth/auth.module";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { PrismaModule } from '@prisma/prisma.module';
import { UserModule } from "@user/user.module";

@Module({
	imports: [
		UserModule,
		AuthModule,
		ConfigModule.forRoot({
			isGlobal:true,
			envFilePath: process.env.NODE_ENV === "production" ? ".env" : ".env.dev",
			validationSchema: Joi.object({
				BASE_URL: Joi.string().required(),
				PORT: Joi.number().required(),

				DATABASE_HOST: Joi.string().required(),
				DATABASE_PORT: Joi.number().required(),
				DATABASE_USER: Joi.string().required(),
				DATABASE_PASSWORD: Joi.string().required(),
				DATABASE_NAME: Joi.string().required(),

				JWT_SECRET_KEY: Joi.string().required(),
				REFRESH_TOKEN_EXPIRE_TIME: Joi.number().required(),
				ACCESS_TOKEN_EXPIRE_TIME: Joi.number().required(),
				BCRYPT_SALT: Joi.number().required(),
			}),
		}),
		PrismaModule
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_PIPE,
			useClass: ValidationPipe,
		},
		{ provide: APP_GUARD, useClass: JwtAuthGuard },
	],
})
export class AppModule {
	constructor() {}
}
