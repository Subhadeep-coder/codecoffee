import {
    Injectable,
    UnauthorizedException,
    BadRequestException,
    ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { AuthProvider, User } from '@prisma/client';
import {
    RegisterDto,
    LoginDto,
    LinkAccountDto,
    ChangePasswordDto,
} from './dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async register(registerDto: RegisterDto) {
        const { email, password, username, firstName, lastName } = registerDto;

        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });

        if (existingUser) {
            throw new ConflictException('User with this email or username already exists');
        }

        const hashedPassword = await argon2.hash(password);

        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                username,
                firstName,
                lastName,
                provider: AuthProvider.LOCAL,
            },
        });

        const tokens = await this.generateTokens(user.id);

        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user || !user.password) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await argon2.verify(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const tokens = await this.generateTokens(user.id);

        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }

    async refreshTokens(userId: string) {
        // const user = await this.prisma.user.findUnique({
        //     where: { id: userId },
        // });

        // if (!user) {
        //     throw new UnauthorizedException('Access denied');
        // }

        // // In production, you should store refresh tokens in database and validate them
        // // For now, we'll just verify the token signature
        // try {
        //     await this.jwtService.verifyAsync(refreshToken, {
        //         secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        //     });
        // } catch {
        //     throw new UnauthorizedException('Invalid refresh token');
        // }

        // const tokens = await this.generateTokens(user.id);
        // return tokens;
        return this.generateTokens(userId);
    }

    async googleLogin(googleUser: any) {
        const { email, firstName, lastName, picture, googleId } = googleUser;

        let user = await this.prisma.user.findUnique({
            where: { email },
            include: { accounts: true },
        });

        if (user) {
            // Check if Google account is already linked
            const googleAccount = user.accounts.find(
                account => account.provider === 'google'
            );

            if (!googleAccount) {
                // Link Google account
                await this.prisma.account.create({
                    data: {
                        userId: user.id,
                        type: 'oauth',
                        provider: 'google',
                        providerAccountId: googleId,
                    },
                });
            }

            // Update user provider if it was LOCAL
            if (user.provider === AuthProvider.LOCAL && !user.password) {
                await this.prisma.user.update({
                    where: { id: user.id },
                    data: { provider: AuthProvider.GOOGLE, providerId: googleId },
                });
            }
        } else {
            // Create new user
            const username = await this.generateUniqueUsername(firstName, lastName);

            user = await this.prisma.user.create({
                data: {
                    email,
                    username,
                    firstName,
                    lastName,
                    avatar: picture,
                    provider: AuthProvider.GOOGLE,
                    providerId: googleId,
                    accounts: {
                        create: {
                            type: 'oauth',
                            provider: 'google',
                            providerAccountId: googleId,
                        },
                    },
                },
                include: { accounts: true },
            });
        }

        const tokens = await this.generateTokens(user.id);

        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }

    async githubLogin(githubUser: any) {
        const { email, login, name, avatar_url, id: githubId } = githubUser;

        // Split name or use login as fallback
        const [firstName, ...lastNameParts] = (name || login).split(' ');
        const lastName = lastNameParts.join(' ') || '';

        let user = await this.prisma.user.findUnique({
            where: { email },
            include: { accounts: true },
        });

        if (user) {
            // Check if GitHub account is already linked
            const githubAccount = user.accounts.find(
                account => account.provider === 'github'
            );

            if (!githubAccount) {
                // Link GitHub account
                await this.prisma.account.create({
                    data: {
                        userId: user.id,
                        type: 'oauth',
                        provider: 'github',
                        providerAccountId: githubId.toString(),
                    },
                });
            }

            // Update user provider if it was LOCAL
            if (user.provider === AuthProvider.LOCAL && !user.password) {
                await this.prisma.user.update({
                    where: { id: user.id },
                    data: { provider: AuthProvider.GITHUB, providerId: githubId.toString() },
                });
            }
        } else {
            // Create new user
            const username = await this.generateUniqueUsername(firstName, lastName, login);

            user = await this.prisma.user.create({
                data: {
                    email: email || `${login}@github.local`, // GitHub might not provide email
                    username,
                    firstName,
                    lastName,
                    avatar: avatar_url,
                    provider: AuthProvider.GITHUB,
                    providerId: githubId.toString(),
                    accounts: {
                        create: {
                            type: 'oauth',
                            provider: 'github',
                            providerAccountId: githubId.toString(),
                        },
                    },
                },
                include: { accounts: true },
            });
        }

        const tokens = await this.generateTokens(user.id);

        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }

    async linkAccount(userId: string, linkAccountDto: LinkAccountDto) {
        const { provider, providerId } = linkAccountDto;

        // Check if account is already linked
        const existingAccount = await this.prisma.account.findUnique({
            where: {
                provider_providerAccountId: {
                    provider,
                    providerAccountId: providerId,
                },
            },
        });

        if (existingAccount) {
            throw new ConflictException('This account is already linked to another user');
        }

        // Create account link
        await this.prisma.account.create({
            data: {
                userId,
                type: 'oauth',
                provider,
                providerAccountId: providerId,
            },
        });

        return { message: 'Account linked successfully' };
    }

    async unlinkAccount(userId: string, provider: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { accounts: true },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // Check if user has password or other accounts
        const hasPassword = !!user.password;
        const otherAccounts = user.accounts.filter(acc => acc.provider !== provider);

        if (!hasPassword && otherAccounts.length === 0) {
            throw new BadRequestException(
                'Cannot unlink the only authentication method. Set a password first.'
            );
        }

        await this.prisma.account.deleteMany({
            where: {
                userId,
                provider,
            },
        });

        return { message: 'Account unlinked successfully' };
    }

    async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
        const { oldPassword, newPassword } = changePasswordDto;

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // If user has a password, validate old password
        if (user.password) {
            const isOldPasswordValid = await argon2.verify(oldPassword!, user.password);
            if (!isOldPasswordValid) {
                throw new UnauthorizedException('Current password is incorrect');
            }
        }

        const hashedPassword = await argon2.hash(newPassword);

        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        return { message: 'Password changed successfully' };
    }

    async logout(userId: string) {
        // In a production app, you might want to blacklist the tokens
        // For now, we'll just return success
        return { message: 'Logged out successfully' };
    }

    private async generateTokens(userId: string) {
        const payload = { sub: userId };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_SECRET'),
                expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '1m'),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
            }),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    private sanitizeUser(user: User) {
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
    }

    private async generateUniqueUsername(firstName: string, lastName: string, fallback?: string): Promise<string> {
        const baseUsername = fallback || `${firstName?.toLowerCase()}${lastName?.toLowerCase()}`.replace(/[^a-z0-9]/g, '');
        let username = baseUsername;
        let counter = 1;

        while (await this.prisma.user.findUnique({ where: { username } })) {
            username = `${baseUsername}${counter}`;
            counter++;
        }

        return username;
    }
}