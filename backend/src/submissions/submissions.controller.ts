import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';

@ApiTags('submissions')
@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post('create')
  @ApiOperation({
    summary: 'Submit or run code for a problem',
    description: 'Run mode only executes visible test cases, Submit mode runs all test cases',
  })
  @ApiQuery({
    name: 'mode',
    required: false,
    enum: ['run', 'submit'],
    description: 'Execution mode - run (sample test cases) or submit (all test cases)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        problemId: { type: 'string', example: 'cmclyc8jv0001i0dz24ehcn9b' },
        code: { type: 'string', example: 'public class Main { ... }' },
        language: { type: 'string', example: 'cpp' },
      },
      required: ['problemId', 'code', 'language'],
    },
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 201,
    description: 'Submission result from judge system.',
  })
  @UseGuards(JwtAuthGuard)
  makeSubmission(
    @GetUser('id') userId: string,
    @Body() createSubmissionDto: CreateSubmissionDto,
    @Query('mode') mode: 'run' | 'submit' = 'submit',
  ) {
    return this.submissionsService.createSubmission({
      ...createSubmissionDto,
      userId,
      mode,
    });
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  checkSubmission(@Param('id') id: string) {
    return this.submissionsService.getSubmissionStatus(id);
  }

  @Get('/get-me/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  getSubmissions(
    @GetUser('id') userId: string,
    @Param('id') problemId: string,
  ) {
    return this.submissionsService.getSubmissions(userId, problemId);
  }
}
