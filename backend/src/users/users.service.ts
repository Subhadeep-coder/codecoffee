import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserProfileDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                accounts: {
                    select: {
                        provider: true,
                        type: true,
                    },
                },
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async updateProfile(id: string, updateUserDto: UpdateUserProfileDto) {
        const user = await this.prisma.user.update({
            where: { id },
            data: updateUserDto,
            include: {
                accounts: {
                    select: {
                        provider: true,
                        type: true,
                    },
                },
            },
        });

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
            include: {
                accounts: true,
            },
        });
    }

    async findByUsername(username: string) {
        const user = await this.prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}