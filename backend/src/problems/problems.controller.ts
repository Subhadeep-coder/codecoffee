import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) { }

  @Get('')
  getProblems() {
    return this.problemsService.getProblems({});
  }

  @Get('/:id')
  getProblemById() { }

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  createProblem(@GetUser('id') userId: string, @Body() body: any) {
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