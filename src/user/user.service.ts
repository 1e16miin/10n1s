import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Connection, Repository } from "typeorm";

import { AuthEntity } from "../auth/entities/auth.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserEntity } from "./entities/user.entity";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		private configService: ConfigService,
		private connection: Connection
	) {
		this.connection = connection;
		this.userRepository = userRepository;
	}

	async create(createUserDto: CreateUserDto): Promise<void> {
		const { email, password, ...remainder } = createUserDto;
		const user = await this.findByEmail(email);
		if (user) {
			throw new ForbiddenException({
				message: `이미 등록된 사용자입니다.`,
				error: "Forbidden",
			});
		}
		const hashedPassword = await bcrypt.hash(
			createUserDto.password,
			this.configService.get("BCRYPT_SALT")
		);

		const newUser = {
			email: email,
			hashedPassword: hashedPassword,
			...remainder,
		};
		const queryRunner = this.connection.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const createUser = this.userRepository.create(newUser);
			await queryRunner.manager.save(createUser);
			const deleteResult = await queryRunner.manager.softDelete(AuthEntity, {
				email,
				deletedAt: null,
			});
			if (deleteResult.affected === 0) {
				throw new ForbiddenException({
					message: `인증되지 않은 이메일입니다.`,
					error: "Forbidden",
				});
			}
			await queryRunner.commitTransaction();
		} catch (err) {
			console.log(err);
			await queryRunner.rollbackTransaction();
			throw err;
		} finally {
			await queryRunner.release();
		}
	}

	async setRefreshToken(refreshToken: string, id: number) {
		await this.userRepository.update(id, {
			refreshToken: refreshToken,
		});
	}

	async getUserIfRefreshTokenMatches(refreshToken: string, id: number) {
		const user = await this.findById(id);

		const isRefreshTokenMatching = refreshToken === user.refreshToken;

		if (isRefreshTokenMatching) {
			return user;
		}
	}

	async removeRefreshToken(id: number) {
		return this.userRepository.update(id, {
			refreshToken: null,
		});
	}

	async findByEmail(email: string): Promise<UserEntity> {
		const result = await this.userRepository.findOne({ email });
		if (result) {
			return result;
		}
	}

	async findById(id: number): Promise<UserEntity> {
		const result = await this.userRepository.findOne({ id });
		if (result) {
			return result;
		}
		throw new NotFoundException({
			message: "존재하지 않는 사용자입니다.",
			error: "Not Found",
		});
	}

	async update(id: number, updateUserDto: UpdateUserDto): Promise<void> {
		if (updateUserDto.password !== undefined) {
			const { password, ...remainder } = updateUserDto;
			const hashedPassword = await bcrypt.hash(
				password,
				this.configService.get("BCRYPT_SALT")
			);
			const updateUser = { hashedPassword: hashedPassword, ...remainder };
			await this.userRepository.update(id, updateUser);
		} else {
			await this.userRepository.update(id, updateUserDto);
		}
	}
}
