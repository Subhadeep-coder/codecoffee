import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProblemsService } from './problems.service';
import {
  CreateProblemDto,
  UpdateProblemDto,
  CreateTestCaseDto,
  UpdateTestCaseDto,
  CreateBoilerplateDto,
  UpdateBoilerplateDto,
  CreateReviewDto,
  UpdateReviewDto,
  ProblemQueryDto,
} from './dto/problem.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Language } from 'generated/prisma';
import { CurrentUser } from 'src/common';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) { }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createProblemDto: CreateProblemDto,
    @CurrentUser() user: any,
  ) {
    return this.problemsService.createProblem(createProblemDto, user.id);
  }

  @Get()
  async findAll(@Query() query: ProblemQueryDto, @CurrentUser() user?: any) {
    return this.problemsService.findAllProblems(query, user?.id);
  }

  @Get('stats')
  async getStats() {
    return this.problemsService.getProblemStats();
  }

  @Get('tags')
  async getPopularTags() {
    return this.problemsService.getPopularTags();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user?: any) {
    return this.problemsService.findProblemById(id, user?.id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateProblemDto: UpdateProblemDto,
    @CurrentUser() user: any,
  ) {
    return this.problemsService.updateProblem(id, updateProblemDto, user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.problemsService.deleteProblem(id, user.id);
  }

  // Test Cases endpoints
  @Post(':id/test-cases')
  @UseGuards(AuthGuard)
  async addTestCase(
    @Param('id') problemId: string,
    @Body() createTestCaseDto: CreateTestCaseDto,
    @CurrentUser() user: any,
  ) {
    return this.problemsService.addTestCase(problemId, createTestCaseDto, user.id);
  }

  @Patch('test-cases/:testCaseId')
  @UseGuards(AuthGuard)
  async updateTestCase(
    @Param('testCaseId') testCaseId: string,
    @Body() updateTestCaseDto: UpdateTestCaseDto,
    @CurrentUser() user: any,
  ) {
    return this.problemsService.updateTestCase(testCaseId, updateTestCaseDto, user.id);
  }

  @Delete('test-cases/:testCaseId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTestCase(
    @Param('testCaseId') testCaseId: string,
    @CurrentUser() user: any,
  ) {
    return this.problemsService.deleteTestCase(testCaseId, user.id);
  }

  // Boilerplates endpoints
  @Post(':id/boilerplates')
  @UseGuards(AuthGuard)
  async addBoilerplate(
    @Param('id') problemId: string,
    @Body() createBoilerplateDto: CreateBoilerplateDto,
    @CurrentUser() user: any,
  ) {
    return this.problemsService.addBoilerplate(problemId, createBoilerplateDto, user.id);
  }

  @Patch(':id/boilerplates/:language')
  @UseGuards(AuthGuard)
  async updateBoilerplate(
    @Param('id') problemId: string,
    @Param('language') language: Language,
    @Body() updateBoilerplateDto: UpdateBoilerplateDto,
    @CurrentUser() user: any,
  ) {
    return this.problemsService.updateBoilerplate(
      problemId,
      language,
      updateBoilerplateDto,
      user.id,
    );
  }

  @Delete(':id/boilerplates/:language')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBoilerplate(
    @Param('id') problemId: string,
    @Param('language') language: Language,
    @CurrentUser() user: any,
  ) {
    return this.problemsService.deleteBoilerplate(problemId, language, user.id);
  }

  // Reviews endpoints
  @Post(':id/reviews')
  @UseGuards(AuthGuard)
  async createReview(
    @Param('id') problemId: string,
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() user: any,
  ) {
    return this.problemsService.createReview(problemId, createReviewDto, user.id);
  }

  @Get(':id/reviews')
  async getReviews(
    @Param('id') problemId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.problemsService.getProblemReviews(
      problemId,
      parseInt(page),
      parseInt(limit),
    );
  }

  @Patch(':id/reviews')
  @UseGuards(AuthGuard)
  async updateReview(
    @Param('id') problemId: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @CurrentUser() user: any,
  ) {
    return this.problemsService.updateReview(problemId, updateReviewDto, user.id);
  }

  @Delete(':id/reviews')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteReview(
    @Param('id') problemId: string,
    @CurrentUser() user: any,
  ) {
    return this.problemsService.deleteReview(problemId, user.id);
  }
}