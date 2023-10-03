import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "@user/dtos/create-user.dto";
import { UpdateUserDto } from "@user/dtos/update-user.dto";
import {User, Prisma} from '@prisma/client';
import { PrismaService } from "@prisma/prisma.service";
import {UserRepository} from "@user/user.repository"

@Injectable()
export class UserService {
	constructor(
		private configService: ConfigService,
		private readonly userRepository: UserRepository
	) {}

	async encodeHashPassword(password: string) {
		return await bcrypt.hash(password, this.configService.get("SALT"))
	}

	async create(createUserDto: CreateUserDto) {
		createUserDto['password'] = await this.encodeHashPassword(createUserDto.password)
		
		return await this.userRepository.createUser(createUserDto);
	}

	async findById(id: number){
		return await this.userRepository.findById(id)
	}
}
