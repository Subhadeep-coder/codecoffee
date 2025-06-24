import {
    IsString,
    IsEnum,
    IsArray,
    IsBoolean,
    IsOptional,
    IsInt,
    Min,
    Max,
    MinLength,
    ArrayMinSize,
    ValidateNested,
    IsNotEmpty
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Difficulty, Language } from 'generated/prisma';

export class CreateProblemDto {
    @IsString()
    @MinLength(3)
    title: string;

    @IsString()
    @MinLength(10)
    description: string;

    @IsEnum(Difficulty)
    difficulty: Difficulty;

    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) => Array.isArray(value) ? value : [value])
    tags: string[];

    @IsOptional()
    @IsInt()
    @Min(500)
    @Max(10000)
    timeLimit?: number = 2000;

    @IsOptional()
    @IsInt()
    @Min(128)
    @Max(1024)
    memoryLimit?: number = 256;

    @IsOptional()
    @IsBoolean()
    isPublic?: boolean = false;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreateTestCaseDto)
    testCases: CreateTestCaseDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateBoilerplateDto)
    boilerplates?: CreateBoilerplateDto[];
}

export class UpdateProblemDto {
    @IsOptional()
    @IsString()
    @MinLength(3)
    title?: string;

    @IsOptional()
    @IsString()
    @MinLength(10)
    description?: string;

    @IsOptional()
    @IsEnum(Difficulty)
    difficulty?: Difficulty;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) => Array.isArray(value) ? value : [value])
    tags?: string[];

    @IsOptional()
    @IsInt()
    @Min(500)
    @Max(10000)
    timeLimit?: number;

    @IsOptional()
    @IsInt()
    @Min(128)
    @Max(1024)
    memoryLimit?: number;

    @IsOptional()
    @IsBoolean()
    isPublic?: boolean;
}

export class CreateTestCaseDto {
    @IsString()
    @IsNotEmpty()
    input: string;

    @IsString()
    @IsNotEmpty()
    output: string;

    @IsOptional()
    @IsBoolean()
    isHidden?: boolean = false;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    points?: number = 10;
}

export class UpdateTestCaseDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    input?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    output?: string;

    @IsOptional()
    @IsBoolean()
    isHidden?: boolean;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    points?: number;
}

export class CreateBoilerplateDto {
    @IsEnum(Language)
    language: Language;

    @IsString()
    @IsNotEmpty()
    code: string;
}

export class UpdateBoilerplateDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    code?: string;
}

export class CreateReviewDto {
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @IsString()
    @MinLength(10)
    comment: string;
}

export class UpdateReviewDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    rating?: number;

    @IsOptional()
    @IsString()
    @MinLength(10)
    comment?: string;
}

export class ProblemQueryDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(Difficulty)
    difficulty?: Difficulty;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) => typeof value === 'string' ? [value] : value)
    tags?: string[];

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 20;

    @IsOptional()
    @IsString()
    sortBy?: string = 'createdAt';

    @IsOptional()
    @IsString()
    sortOrder?: 'asc' | 'desc' = 'desc';

    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    isPublic?: boolean;

    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    isApproved?: boolean;
}