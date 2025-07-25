import { ContestType } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateContestDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsEnum(ContestType)
  type: ContestType;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsNumber()
  @Min(1)
  duration: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10000)
  maxParticipants?: number;

  @IsBoolean()
  isRated: boolean;

  @IsNumber()
  @Min(0)
  @Max(60)
  penalty: number;

  @IsArray()
  @IsString({ each: true })
  problemIds: string[];
}
