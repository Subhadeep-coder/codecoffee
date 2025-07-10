import { IsString } from 'class-validator';

export class CreateSubmissionDto {
  @IsString()
  problemId: string;
  @IsString()
  code: string;
  @IsString()
  language: 'cpp' | 'java' | 'python' | 'c' | 'js' | 'ts';
}
