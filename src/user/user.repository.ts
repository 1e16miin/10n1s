import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from "@prisma/prisma.service";

@Injectable()
export class UserRepository {
  
  constructor(private prisma: PrismaService) {}

  async create(userCreateInput: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({data: userCreateInput});
  }

  async update(id: number, userUpdateInput: Prisma.UserUpdateInput): Promise<User> {
    return await this.prisma.user.update({data: userUpdateInput, where: {id: id}});
  }

  async findByEmail(email: string){
    return await this.prisma.user.findUnique({where: {email: email}})
  }

  async findById(id: number){
    return await this.prisma.user.findUnique({where: {id: id}})
  }
}
