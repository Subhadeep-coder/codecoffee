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
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('problems')
@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) { }

  @Get('/')
  getProblems(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('difficulty') difficulty: string,
    @Query('tags') tags: string,
    @Query('search') search: string,
    @Query('company') company: string,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: string,
    @Query('showPremium') showPremium: string
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

  @ApiParam({ name: 'provider', enum: ['google', 'github'], description: 'Social provider to unlink' })
  @Get('/:slug')
  getProblemById(@Param('slug') slug: string) {
    return this.problemsService.getProblemById(slug);
  }

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  createProblem(@GetUser('id') userId: string, @Body() body: CreateProblemsDto) {
    return this.problemsService.createProblem(userId, body);
  }

  @Patch('/update/:id')
  @UseGuards(JwtAuthGuard)
  updateProblem(@GetUser('id') userId: string, @Param('id') problemId: string, @Body() body: any) {
    return this.problemsService.updateProblem(userId, problemId, body);
  }

  @Delete('/delete/:id')
  @UseGuards(JwtAuthGuard)
  deleteProblem(@GetUser('id') userId: string, @Param('id') problemId: string) {
    return this.problemsService.deleteProblem(userId, problemId);
  }
}