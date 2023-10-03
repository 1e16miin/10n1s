import { Controller, Get } from "@nestjs/common";
import { Public } from "./common/decorators/skip-auth.decorator";
import { AppService } from './app.service';

@Public()
@Controller("")
export class AppController {
	constructor(private readonly appService: AppService) {}
	@Get("health")
	isHealth() {
		return "healthy";
	}
	@Get("")
	hello(){
		this.appService.getHello()
	}
}
