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

  @IsOptional()
  @IsString()
  mainClass?: string;

  @IsString()
  methodName: string;

  @IsString()
  returnType: string;

  @IsArray()
  @IsString({ each: true })
  paramTypes: string[];
}

class InputFormatDto {
  @IsString()
  formatType: string;

  @IsString()
  parseMethod: string;
}

class OutputFormatDto {
  @IsString()
  formatType: string;

  @IsString()
  parseMethod: string;
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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InputFormatDto)
  inputFormats?: InputFormatDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OutputFormatDto)
  outputFormats?: OutputFormatDto[];
}
