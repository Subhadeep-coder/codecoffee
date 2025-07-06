import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common';
import { CreateProblemsDto } from './dto';
import {
  ApiParam,
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('problems')
@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Get('/')
  @ApiOperation({
    summary: 'Get a paginated list of problems with filters and sorting.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: String,
    description: 'Page number for pagination.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: String,
    description: 'Number of problems per page.',
  })
  @ApiQuery({
    name: 'difficulty',
    required: false,
    type: String,
    description: 'Filter by difficulty.',
  })
  @ApiQuery({
    name: 'tags',
    required: false,
    type: String,
    description: 'Filter by tags (comma-separated).',
  })
  @ApiQuery({
    name: 'company',
    required: false,
    type: String,
    description: 'Filter by company.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for problem title/description.',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Field to sort by.',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    type: String,
    description: 'Sort order (asc or desc).',
  })
  @ApiQuery({
    name: 'showPremium',
    required: false,
    type: String,
    description: 'Whether to include premium problems.',
  })
  @ApiResponse({ status: 200, description: 'Paginated list of problems.' })
  getProblems(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('difficulty') difficulty: string,
    @Query('tags') tags: string,
    @Query('search') search: string,
    @Query('company') company: string,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: string,
    @Query('showPremium') showPremium: string,
  ) {
    return this.problemsService.getProblems({
      page,
      limit,
      difficulty,
      tags,
      company,
      search,
      sortBy,
      sortOrder,
      showPremium,
    });
  }

  @ApiOperation({ summary: 'Get a problem by its slug.' })
  @ApiParam({
    name: 'slug',
    type: String,
    description: 'The unique slug of the problem.',
  })
  @ApiResponse({ status: 200, description: 'Problem details.' })
  @Get('/:slug')
  getProblemById(@Param('slug') slug: string) {
    return this.problemsService.getProblemById(slug);
  }

  @ApiOperation({ summary: 'Create a new problem.' })
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: CreateProblemsDto })
  @ApiResponse({ status: 201, description: 'The created problem.' })
  @Post('/create')
  @UseGuards(JwtAuthGuard)
  createProblem(
    @GetUser('id') userId: string,
    @Body() body: CreateProblemsDto,
  ) {
    return this.problemsService.createProblem(userId, body);
  }

  @ApiOperation({ summary: 'Update an existing problem.' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the problem to update.',
  })
  @ApiBody({ description: 'Partial problem data', type: Object })
  @ApiResponse({ status: 200, description: 'The updated problem.' })
  @Patch('/update/:id')
  @UseGuards(JwtAuthGuard)
  updateProblem(
    @GetUser('id') userId: string,
    @Param('id') problemId: string,
    @Body() body: any,
  ) {
    return this.problemsService.updateProblem(userId, problemId, body);
  }

  @ApiOperation({ summary: 'Delete a problem.' })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the problem to delete.',
  })
  @ApiResponse({
    status: 200,
    description: 'Success message or deleted problem info.',
  })
  @Delete('/delete/:id')
  @UseGuards(JwtAuthGuard)
  deleteProblem(@GetUser('id') userId: string, @Param('id') problemId: string) {
    return this.problemsService.deleteProblem(userId, problemId);
  }
}
