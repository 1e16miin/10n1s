// import {
// 	CanActivate,
// 	ExecutionContext,
// 	ForbiddenException,
// 	Injectable,
// } from "@nestjs/common";
// import { Reflector } from "@nestjs/core";

// import { PlanService } from "../../user/plan.service";

// const matchRoles = (roles: string[], userRoles: string) => {
// 	return roles.some((role) => role === userRoles);
// };

// @Injectable()
// export class RolesGuard implements CanActivate {
// 	constructor(private reflector: Reflector, private planService: PlanService) {}
// 	async canActivate(context: ExecutionContext): Promise<boolean> {
// 		const requiredRoles = this.reflector.getAllAndOverride<string[]>("roles", [
// 			context.getHandler(),
// 			context.getClass(),
// 		]);
// 		if (!requiredRoles) {
// 			return true;
// 		}
// 		const req = context.switchToHttp().getRequest() as any;
// 		const user = req.user;
// 		return matchRoles(requiredRoles, user.role);
// 	}
// }
