import {
  IsOptional,
  IsString,
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

class ProblemTemplateDto {
  @IsString()
  language: string;

  @IsString()
  template: string; // base64 encoded

  @IsString()
  templateIdentifier: string;
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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProblemTemplateDto)
  problemTemplates?: ProblemTemplateDto[];
}
