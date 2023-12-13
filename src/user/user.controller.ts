import { Controller } from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiInternalServerErrorResponse,
	ApiTags,
	ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { UserService } from "./user.service";

@ApiUnauthorizedResponse({
	description: "토큰 인증 오류",
	schema: {
		example: {
			message: "Unauthorized",
			timestamp: "2022-01-03T08:42:44.801Z",
		},
	},
})
@ApiBadRequestResponse({
	description: "요청 parameter 오류",
	schema: {
		example: {
			message: "Bad Request",
			timestamp: "2022-01-03T08:42:44.801Z",
		},
	},
})
@ApiInternalServerErrorResponse({
	description: "서버 내부 오류",
	schema: {
		example: {
			message: "알 수 없는 오류가 발생하였습니다.",
			timestamp: "2022-01-03T08:42:44.801Z",
		},
	},
})
@ApiTags("User")
@Controller("user")
export class UserController {
	constructor(
		private userService: UserService
	) {
		this.userService = userService;
	}	
}
