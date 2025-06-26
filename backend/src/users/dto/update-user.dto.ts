import { IsString, IsOptional, MaxLength, MinLength, IsUrl } from 'class-validator';

export class UpdateUserProfileDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    firstName?: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    lastName?: string;

    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    username?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    bio?: string;

    @IsOptional()
    @IsUrl()
    avatar?: string;
}