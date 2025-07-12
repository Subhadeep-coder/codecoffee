import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ContestType } from '@prisma/client';
import { ContestsService } from './contests.service';
import { CreateContestDto } from './dto/create-contest.dto';
import { GetUser } from 'src/common';
import { ContestQueryDto } from './dto/contest-query.dto';
import { UpdateContestDto } from './dto/update-contest.dto';

@ApiTags('Contests')
@Controller('contests')
export class ContestsController {
  constructor(private readonly contestService: ContestsService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new contest' })
  @ApiResponse({
    status: 201,
    description: 'Contest created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - User not authenticated',
  })
  async createContest(
    @GetUser('id') userId: string,
    @Body(ValidationPipe) createContestDto: CreateContestDto,
  ) {
    return this.contestService.createContest(userId, createContestDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all contests with filtering and pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ContestType,
    description: 'Contest type',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Contest status',
  })
  @ApiResponse({
    status: 200,
    description: 'Contests retrieved successfully',
  })
  async getContests(@Query(ValidationPipe) query: ContestQueryDto) {
    return this.contestService.getContests(
      query.page,
      query.limit,
      query.type,
      query.status,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contest by ID' })
  @ApiParam({ name: 'id', description: 'Contest ID' })
  @ApiResponse({
    status: 200,
    description: 'Contest retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Contest not found',
  })
  async getContestById(@Param('id') id: string) {
    return this.contestService.getContestById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update contest' })
  @ApiParam({ name: 'id', description: 'Contest ID' })
  @ApiResponse({
    status: 200,
    description: 'Contest updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Contest already started or invalid data',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not contest owner',
  })
  @ApiResponse({
    status: 404,
    description: 'Contest not found',
  })
  async updateContest(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body(ValidationPipe) updateContestDto: UpdateContestDto,
  ) {
    const contestData = {
      ...updateContestDto,
      ...(updateContestDto.startTime && {
        startTime: new Date(updateContestDto.startTime),
      }),
      ...(updateContestDto.endTime && {
        endTime: new Date(updateContestDto.endTime),
      }),
    };

    return this.contestService.updateContest(id, userId, contestData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete contest' })
  @ApiParam({ name: 'id', description: 'Contest ID' })
  @ApiResponse({
    status: 204,
    description: 'Contest deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Contest has participants',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not contest owner',
  })
  @ApiResponse({
    status: 404,
    description: 'Contest not found',
  })
  async deleteContest(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.contestService.deleteContest(id, userId);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Join a contest' })
  @ApiParam({ name: 'id', description: 'Contest ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully joined contest',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Already joined, contest full, or contest ended',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Private contest',
  })
  @ApiResponse({
    status: 404,
    description: 'Contest not found',
  })
  async joinContest(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.contestService.joinContest(id, userId);
  }

  @Post(':id/leave')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Leave a contest' })
  @ApiParam({ name: 'id', description: 'Contest ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully left contest',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Contest already started',
  })
  @ApiResponse({
    status: 404,
    description: 'Contest not found or not participating',
  })
  async leaveContest(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.contestService.leaveContest(id, userId);
  }

  // @Post(':id/submit')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Submit solution to contest problem' })
  // @ApiParam({ name: 'id', description: 'Contest ID' })
  // @ApiResponse({
  //   status: 201,
  //   description: 'Submission created successfully',
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Bad request - Contest not active or problem not in contest',
  // })
  // @ApiResponse({
  //   status: 403,
  //   description: 'Forbidden - Not participating in contest',
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: 'Contest not found',
  // })
  // async submitSolution(
  //   @Param('id') id: string,
  //   @GetUser('id') userId: string,
  //   @Body(ValidationPipe) submissionDto: ContestSubmissionDto,
  // ) {
  //   return this.contestService.submitSolution(id, userId, submissionDto);
  // }

  @Get(':id/ranking')
  @ApiOperation({ summary: 'Get contest leaderboard/ranking' })
  @ApiParam({ name: 'id', description: 'Contest ID' })
  @ApiResponse({
    status: 200,
    description: 'Contest ranking retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Contest not found',
  })
  async getContestRanking(@Param('id') id: string) {
    return this.contestService.getContestRanking(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get contest statistics' })
  @ApiParam({ name: 'id', description: 'Contest ID' })
  @ApiResponse({
    status: 200,
    description: 'Contest statistics retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Contest not found',
  })
  async getContestStats(@Param('id') id: string) {
    return this.contestService.getContestStats(id);
  }

  @Post(':id/update-ratings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update contest ratings (Admin only)' })
  @ApiParam({ name: 'id', description: 'Contest ID' })
  @ApiResponse({
    status: 200,
    description: 'Ratings updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({
    status: 404,
    description: 'Contest not found',
  })
  async updateContestRatings(@Param('id') id: string, @Request() req: any) {
    // Note: You should add admin role check here
    // if (req.user.role !== 'ADMIN') throw new ForbiddenException();
    return this.contestService.updateContestRatings(id);
  }
}

// @ApiTags('User Contest History')
// @Controller('users')
// export class UserContestController {
//   constructor(private readonly contestService: ContestService) {}

//   @Get('me/contests')
//   @UseGuards(JwtAuthGuard)
//   @ApiBearerAuth()
//   @ApiOperation({ summary: 'Get current user contest history' })
//   @ApiQuery({
//     name: 'page',
//     required: false,
//     type: Number,
//     description: 'Page number',
//   })
//   @ApiQuery({
//     name: 'limit',
//     required: false,
//     type: Number,
//     description: 'Items per page',
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'User contest history retrieved successfully',
//   })
//   async getMyContestHistory(
//     @Request() req: any,
//     @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
//     @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
//   ) {
//     return this.contestService.getUserContestHistory(req.user.id, page, limit);
//   }

//   @Get(':userId/contests')
//   @ApiOperation({ summary: 'Get user contest history by user ID' })
//   @ApiParam({ name: 'userId', description: 'User ID' })
//   @ApiQuery({
//     name: 'page',
//     required: false,
//     type: Number,
//     description: 'Page number',
//   })
//   @ApiQuery({
//     name: 'limit',
//     required: false,
//     type: Number,
//     description: 'Items per page',
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'User contest history retrieved successfully',
//   })
//   async getUserContestHistory(
//     @Param('userId') userId: string,
//     @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
//     @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
//   ) {
//     return this.contestService.getUserContestHistory(userId, page, limit);
//   }
// }

// // WebSocket Controller for real-time contest updates
// @ApiTags('Contest Real-time')
// @Controller('contests/ws')
// export class ContestWebSocketController {
//   constructor(private readonly contestService: ContestService) {}

//   @Get(':id/live-ranking')
//   @ApiOperation({
//     summary: 'Get live contest ranking (for WebSocket connection)',
//   })
//   @ApiParam({ name: 'id', description: 'Contest ID' })
//   @ApiResponse({
//     status: 200,
//     description: 'Live contest ranking endpoint',
//   })
//   async getLiveRanking(@Param('id') id: string) {
//     // This would typically return WebSocket connection info
//     // For now, return the current ranking
//     return this.contestService.getContestRanking(id);
//   }
// }

// // Contest Admin Controller (for admin operations)
// @ApiTags('Contest Admin')
// @Controller('admin/contests')
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
// export class ContestAdminController {
//   constructor(private readonly contestService: ContestService) {}

//   @Get()
//   @ApiOperation({ summary: 'Get all contests (Admin view)' })
//   @ApiQuery({ name: 'page', required: false, type: Number })
//   @ApiQuery({ name: 'limit', required: false, type: Number })
//   @ApiResponse({
//     status: 200,
//     description: 'All contests retrieved successfully',
//   })
//   async getAllContests(
//     @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
//     @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
//   ) {
//     // Note: Add admin role check here
//     return this.contestService.getContests(page, limit);
//   }

//   @Post(':id/force-end')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Force end a contest (Admin only)' })
//   @ApiParam({ name: 'id', description: 'Contest ID' })
//   @ApiResponse({
//     status: 200,
//     description: 'Contest force ended successfully',
//   })
//   async forceEndContest(@Param('id') id: string, @Request() req: any) {
//     // Note: Add admin role check and implementation
//     // This would update the contest endTime to now
//     throw new Error(
//       'Not implemented - requires admin role check and contest update logic',
//     );
//   }

//   @Post(':id/recalculate-ratings')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Recalculate contest ratings (Admin only)' })
//   @ApiParam({ name: 'id', description: 'Contest ID' })
//   @ApiResponse({
//     status: 200,
//     description: 'Ratings recalculated successfully',
//   })
//   async recalculateRatings(@Param('id') id: string, @Request() req: any) {
//     // Note: Add admin role check here
//     return this.contestService.updateContestRatings(id);
//   }
// }
