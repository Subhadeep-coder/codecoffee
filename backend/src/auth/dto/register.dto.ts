import { IsEmail, IsString, MinLength, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({
        description: 'User\'s email address',
        example: 'user@example.com'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'User\'s password',
        example: 'password123',
        minLength: 6,
        maxLength: 50
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    password: string;

    @ApiProperty({
        description: 'User\'s unique username',
        example: 'johndoe',
        minLength: 3,
        maxLength: 30
    })
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    username: string;

    @ApiProperty({
        description: 'User\'s first name',
        example: 'John',
        minLength: 2,
        maxLength: 50
    })
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    firstName: string;

    @ApiProperty({
        description: 'User\'s last name',
        example: 'Doe',
        minLength: 2,
        maxLength: 50
    })
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    lastName: string;
}
