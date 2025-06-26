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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Language } from 'generated/prisma';
import { GetUser } from 'src/common';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createProblemDto: CreateProblemDto,
    @GetUser() user: any,
  ) {
    return this.problemsService.createProblem(createProblemDto, user.id);
  }

  @Get()
  async findAll(@Query() query: ProblemQueryDto, @GetUser() user?: any) {
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
  async findOne(@Param('id') id: string, @GetUser() user?: any) {
    return this.problemsService.findProblemById(id, user?.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateProblemDto: UpdateProblemDto,
    @GetUser() user: any,
  ) {
    return this.problemsService.updateProblem(id, updateProblemDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @GetUser() user: any) {
    return this.problemsService.deleteProblem(id, user.id);
  }

  // Test Cases endpoints
  @Post(':id/test-cases')
  @UseGuards(JwtAuthGuard)
  async addTestCase(
    @Param('id') problemId: string,
    @Body() createTestCaseDto: CreateTestCaseDto,
    @GetUser() user: any,
  ) {
    return this.problemsService.addTestCase(problemId, createTestCaseDto, user.id);
  }

  @Patch('test-cases/:testCaseId')
  @UseGuards(JwtAuthGuard)
  async updateTestCase(
    @Param('testCaseId') testCaseId: string,
    @Body() updateTestCaseDto: UpdateTestCaseDto,
    @GetUser() user: any,
  ) {
    return this.problemsService.updateTestCase(testCaseId, updateTestCaseDto, user.id);
  }

  @Delete('test-cases/:testCaseId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTestCase(
    @Param('testCaseId') testCaseId: string,
    @GetUser() user: any,
  ) {
    return this.problemsService.deleteTestCase(testCaseId, user.id);
  }

  // Boilerplates endpoints
  @Post(':id/boilerplates')
  @UseGuards(JwtAuthGuard)
  async addBoilerplate(
    @Param('id') problemId: string,
    @Body() createBoilerplateDto: CreateBoilerplateDto,
    @GetUser() user: any,
  ) {
    return this.problemsService.addBoilerplate(problemId, createBoilerplateDto, user.id);
  }

  @Patch(':id/boilerplates/:language')
  @UseGuards(JwtAuthGuard)
  async updateBoilerplate(
    @Param('id') problemId: string,
    @Param('language') language: Language,
    @Body() updateBoilerplateDto: UpdateBoilerplateDto,
    @GetUser() user: any,
  ) {
    return this.problemsService.updateBoilerplate(
      problemId,
      language,
      updateBoilerplateDto,
      user.id,
    );
  }

  @Delete(':id/boilerplates/:language')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBoilerplate(
    @Param('id') problemId: string,
    @Param('language') language: Language,
    @GetUser() user: any,
  ) {
    return this.problemsService.deleteBoilerplate(problemId, language, user.id);
  }

  // Reviews endpoints
  @Post(':id/reviews')
  @UseGuards(JwtAuthGuard)
  async createReview(
    @Param('id') problemId: string,
    @Body() createReviewDto: CreateReviewDto,
    @GetUser() user: any,
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
  @UseGuards(JwtAuthGuard)
  async updateReview(
    @Param('id') problemId: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @GetUser() user: any,
  ) {
    return this.problemsService.updateReview(problemId, updateReviewDto, user.id);
  }

  @Delete(':id/reviews')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteReview(
    @Param('id') problemId: string,
    @GetUser() user: any,
  ) {
    return this.problemsService.deleteReview(problemId, user.id);
  }
}