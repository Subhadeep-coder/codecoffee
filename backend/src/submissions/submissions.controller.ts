import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common';

@ApiTags('submissions')
@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post('create')
  @ApiOperation({ summary: 'Submit code for a problem to the judge system.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        problemId: { type: 'string', example: 'cmclyc8jv0001i0dz24ehcn9b' },
        code: { type: 'string', example: 'public class Main { ... }' },
        language: { type: 'string', example: 'cpp' },
        userId: { type: 'string', example: 'cmcl2urzc0000i00e4zcnwslb' },
      },
      required: ['problemId', 'code', 'language', 'userId'],
    },
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 201,
    description: 'Submission result from judge system.',
  })
  @UseGuards(JwtAuthGuard)
  makeSubmission(@GetUser('id') userId: string, @Body() body: any) {
    return this.submissionsService.createSubmission(userId, body);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  checkSubmission(@Param('id') id: string) {
    return this.submissionsService.getSubmissionStatus(id);
  }
}
