import { IsOptional, IsString, IsEnum, IsIn } from 'class-validator';

export class GetProblemsDto {
    @IsOptional()
    @IsString()
    page?: string;

    @IsOptional()
    @IsString()
    limit?: string;

    @IsOptional()
    @IsString()
    difficulty?: string;

    @IsOptional()
    @IsString()
    tags?: string;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    company?: string;

    @IsOptional()
    @IsIn(['createdAt', 'updatedAt', 'title', 'difficulty', 'acceptanceRate', 'frequency'])
    sortBy?: string;

    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortOrder?: string;

    @IsOptional()
    @IsIn(['true', 'false'])
    showPremium?: string;
}