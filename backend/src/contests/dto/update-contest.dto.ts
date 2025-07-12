import {
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
import { ContestType } from '@prisma/client';

export class UpdateContestDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsEnum(ContestType)
  type?: ContestType;

  @IsOptional()
  @IsDateString()
  startTime?: Date;

  @IsOptional()
  @IsDateString()
  endTime?: Date;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1440)
  duration?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10000)
  maxParticipants?: number;

  @IsOptional()
  @IsBoolean()
  isRated?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(60)
  penalty?: number;
}
