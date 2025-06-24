import {
    Injectable,
    ConflictException,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthProvider, User } from 'generated/prisma';
import { ConfigService } from '@nestjs/config';
import { LinkProviderDto, RegisterDto } from './dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
    ) { }

    async register(registerDto: RegisterDto): Promise<Omit<User, 'password'>> {
        const { email, username, password, firstName, lastName, bio } = registerDto;

        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });

        if (existingUser) {
            if (existingUser.email === email) {
                throw new ConflictException('Email already registered');
            }
            if (existingUser.username === username) {
                throw new ConflictException('Username already taken');
            }
        }

        const hashedPassword = await argon2.hash(password);

        const user = await this.prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                firstName,
                lastName,
                bio,
                provider: AuthProvider.LOCAL,
            },
            omit: {
                password: true,
            },
        });

        return user;
    }

    async validateUser(emailOrUsername: string, password: string): Promise<any> {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: emailOrUsername },
                    { username: emailOrUsername },
                ],
                provider: AuthProvider.LOCAL,
            },
        });

        if (!user || !user.password) {
            return null;
        }

        const isPasswordValid = await argon2.verify(password, user.password);
        if (!isPasswordValid) {
            return null;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...result } = user;
        return result;
    }

    async findOrCreateGoogleUser(profile: any): Promise<User> {
        const { providerId, email, firstName, lastName, avatar, accessToken, refreshToken } = profile;

        // Check if user exists with this Google ID
        let account = await this.prisma.account.findUnique({
            where: {
                provider_providerAccountId: {
                    provider: 'google',
                    providerAccountId: providerId,
                },
            },
            include: { user: true },
        });

        if (account) {
            // Update tokens
            await this.prisma.account.update({
                where: { id: account.id },
                data: {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                },
            });
            return account.user;
        }

        // Check if user exists with this email
        let user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Create new user
            user = await this.prisma.user.create({
                data: {
                    email,
                    username: `user_${Date.now()}`, // Generate temporary username
                    firstName,
                    lastName,
                    avatar,
                    provider: AuthProvider.GOOGLE,
                    providerId,
                },
            });
        }

        // Create account link
        await this.prisma.account.create({
            data: {
                userId: user.id,
                type: 'oauth',
                provider: 'google',
                providerAccountId: providerId,
                access_token: accessToken,
                refresh_token: refreshToken,
            },
        });

        return user;
    }

    async linkProvider(userId: string, linkProviderDto: LinkProviderDto): Promise<void> {
        const { provider, providerAccountId, accessToken, refreshToken, expiresAt } = linkProviderDto;

        // Check if this provider account is already linked to another user
        const existingAccount = await this.prisma.account.findUnique({
            where: {
                provider_providerAccountId: {
                    provider: provider.toLowerCase(),
                    providerAccountId,
                },
            },
        });

        if (existingAccount && existingAccount.userId !== userId) {
            throw new ConflictException('This account is already linked to another user');
        }

        if (existingAccount && existingAccount.userId === userId) {
            throw new ConflictException('This account is already linked to your profile');
        }

        // Create the account link
        await this.prisma.account.create({
            data: {
                userId,
                type: 'oauth',
                provider: provider.toLowerCase(),
                providerAccountId,
                access_token: accessToken,
                refresh_token: refreshToken,
                expires_at: expiresAt,
            },
        });
    }

    async unlinkProvider(userId: string, provider: string): Promise<void> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { accounts: true },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Check if user has a local account or other providers
        const hasLocalAuth = user.provider === AuthProvider.LOCAL && user.password;
        const otherProviders = user.accounts.filter(
            (account) => account.provider !== provider.toLowerCase()
        );

        if (!hasLocalAuth && otherProviders.length === 0) {
            throw new BadRequestException(
                'Cannot unlink the only authentication method. Please set up a password first.'
            );
        }

        // Find and delete the account
        const account = await this.prisma.account.findFirst({
            where: {
                userId,
                provider: provider.toLowerCase(),
            },
        });

        if (!account) {
            throw new NotFoundException('Provider not linked to this account');
        }

        await this.prisma.account.delete({
            where: { id: account.id },
        });
    }

    async getUserWithAccounts(userId: string): Promise<User & { accounts: any[] }> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                accounts: {
                    select: {
                        id: true,
                        provider: true,
                        createdAt: true,
                    },
                },
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword as any;
    }
}