import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-clients/jobber-auth';
import { PrismaService } from '../prisma/prisma.service';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) {}

    async getUsers() {
        return this.prismaService.user.findMany();
    }

    async createUser(data: Prisma.UserCreateInput) {
        return this.prismaService.user.create({
            data: {
                email: data.email,
                password: await hash(data.password, 10),
            },
        });
    }
}
