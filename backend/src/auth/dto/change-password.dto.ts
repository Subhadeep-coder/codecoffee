import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class ChangePasswordDto {
    @IsString()
    @IsOptional()
    oldPassword?: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    newPassword: string;
}