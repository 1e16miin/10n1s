import {
	Injectable,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {UserRepository} from "@user/user.repository"
import { Prisma } from "@prisma/client";

@Injectable()
export class UserService {
	constructor(
		private configService: ConfigService,
		private readonly userRepository: UserRepository
	) {}
	async create(createUserInput: Prisma.UserCreateInput) {
		return await this.userRepository.create(createUserInput);
	}

	async update(id: number, updateUserInput: Prisma.UserUpdateInput){
		return await this.userRepository.update(id, updateUserInput);
	}
	async findByEmail(email: any){
		return await this.userRepository.findByEmail(email)
	}
}
