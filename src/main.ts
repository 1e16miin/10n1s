import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";

declare const module: any;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const globalPrefix = "/api/v1";
	app.setGlobalPrefix(globalPrefix);
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
			transformOptions: {
				enableImplicitConversion: true,
			},
		})
	);
	app.useGlobalFilters(new HttpExceptionFilter());
	const config = new DocumentBuilder()
		.setTitle("10n1s")
		.setDescription("10n1s API description")
		.build();
	const document = SwaggerModule.createDocument(app, config);
	// const options: SwaggerDocumentOptions = {
	//   operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
	// };
	const whitelist = [
		// app endpoint url
	];
	SwaggerModule.setup(`api-docs`, app, document, {
		swaggerOptions: { defaultModelsExpandDepth: -1 },
	});
	app.enableCors({
		origin: function (origin, callback) {
			if (!origin || whitelist.indexOf(origin) !== -1) {
				callback(null, true);
			} else {
				console.log("origin: ", origin);
				callback(new Error("Not allowed by CORS"));
			}
		},
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
		credentials: true,
	});
	SwaggerModule.setup(`api-docs`, app, document);
	await app.init();
	const configService = app.get(ConfigService);

	await app.listen(configService.get("PORT"));
	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}
	console.log(`${configService.get("PORT")}번 포트 대기중`);
}
bootstrap();
