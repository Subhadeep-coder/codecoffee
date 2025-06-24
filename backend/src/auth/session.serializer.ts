import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service'; // Adjust import path

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(private prisma: PrismaService) {
        super();
    }

    serializeUser(user: any, done: (err: Error | null, user: any) => void): any {
        done(null, { id: user.id });
    }

    async deserializeUser(
        payload: { id: string },
        done: (err: Error | null, user: any) => void,
    ): Promise<any> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: payload.id },
                include: {
                    accounts: true,
                },
            });
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    }
}