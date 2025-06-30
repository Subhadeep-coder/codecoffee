import {
    IsOptional,
    IsString,
    IsIn,
    IsArray,
    ValidateNested,
    IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

class TestCaseDto {
    @IsString()
    input: string;

    @IsString()
    expectedOutput: string;

    @IsBoolean()
    isHidden: boolean;

    @IsString()
    explanation: string;
}

export class CreateProblemsDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    difficulty: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags: string[] = [];

    @IsString()
    constraints: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    hints: string[] = [];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    companies: string[] = [];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TestCaseDto)
    testCases: TestCaseDto[] = [];

    @IsOptional()
    @IsBoolean()
    isPremium?: boolean;
}
