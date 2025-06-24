import { IsEnum, IsOptional, IsString } from "class-validator";
import { AuthProvider } from "generated/prisma";

export class LinkProviderDto {
    @IsEnum(AuthProvider)
    provider: AuthProvider;

    @IsString()
    providerAccountId: string;

    @IsOptional()
    @IsString()
    accessToken?: string;

    @IsOptional()
    @IsString()
    refreshToken?: string;

    @IsOptional()
    expiresAt?: number;
}