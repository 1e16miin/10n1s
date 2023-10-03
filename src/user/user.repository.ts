import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from "@prisma/prisma.service";
import { CreateUserDto } from '@user/dtos/create-user.dto';

@Injectable()
export class UserRepository {
  
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    return await this.prisma.user.create({data: createUserDto});
  }

  async findById(id: number){
    return await this.prisma.user.findUnique({where: {id: id}})
  }
}
