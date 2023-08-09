import { Controller, Get } from "@nestjs/common";
import { Public } from "./common/decorators/skip-auth.decorator";

@Public()
@Controller("")
export class AppController {
	@Get("health")
	isHealth() {
		return "healthy";
	}
}
