import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateContestDto } from './dto/create-contest.dto';
import { ContestType, Prisma, SubmissionStatus } from '@prisma/client';
import { UpdateContestDto } from './dto/update-contest.dto';
import { ContestRankingItem, ContestSubmissionDto } from './dto/types';

@Injectable()
export class ContestsService {
  constructor(private prisma: PrismaService) {}

  // Create a new contest
  async createContest(userId: string, createContestDto: CreateContestDto) {
    const { problemIds, ...contestData } = createContestDto;
    const refineContestData = {
      ...contestData,
      startTime: new Date(contestData.startTime),
      endTime: new Date(contestData.endTime),
    };

    // Validate that all problems exist
    const problems = await this.prisma.problem.findMany({
      where: { id: { in: problemIds } },
    });

    if (problems.length !== problemIds.length) {
      throw new BadRequestException('One or more problems not found');
    }

    // Validate contest timing
    if (createContestDto.startTime >= createContestDto.endTime) {
      throw new BadRequestException('Start time must be before end time');
    }

    return this.prisma.$transaction(async (tx) => {
      // Create contest
      const contest = await tx.contest.create({
        data: {
          ...refineContestData,
          createdBy: userId,
        },
      });
      console.log('Contest: ', contest);
      // Add problems to contest
      const contestProblems = problemIds.map((problemId, index) => ({
        contestId: contest.id,
        problemId,
        order: index + 1,
        points: 100, // Default points, can be customized
      }));

      console.log('Problems: ', contestProblems);

      await tx.contestProblem.createMany({
        data: contestProblems,
      });

      return {
        ...contest,
        problems: contestProblems.map((cp) => ({
          problemId: cp.problemId,
          order: cp.order,
          points: cp.points,
        })),
      };
    });
  }

  // Get contest by ID with full details
  async getContestById(contestId: string) {
    const contest = await this.prisma.contest.findUnique({
      where: { id: contestId },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        problems: {
          orderBy: { order: 'asc' },
          include: {
            problem: {
              select: {
                id: true,
                title: true,
                slug: true,
                difficulty: true,
                tags: true,
                acceptanceRate: true,
              },
            },
          },
        },
        participations: {
          select: {
            id: true,
            userId: true,
            score: true,
            penalty: true,
            rank: true,
          },
        },
        _count: {
          select: {
            participations: true,
          },
        },
      },
    });

    if (!contest) {
      throw new NotFoundException('Contest not found');
    }

    return contest;
  }

  // Get all contests with pagination and filters
  async getContests(
    page: number = 1,
    limit: number = 10,
    type?: ContestType,
    status?: 'upcoming' | 'ongoing' | 'ended',
  ) {
    const skip = (page - 1) * limit;
    const now = new Date();

    let timeFilter: Prisma.ContestWhereInput = {};
    if (status === 'upcoming') {
      timeFilter = { startTime: { gt: now } };
    } else if (status === 'ongoing') {
      timeFilter = {
        startTime: { lte: now },
        endTime: { gt: now },
      };
    } else if (status === 'ended') {
      timeFilter = { endTime: { lt: now } };
    }

    const where: Prisma.ContestWhereInput = {
      ...(type && { type }),
      ...timeFilter,
    };

    const [contests, total] = await Promise.all([
      this.prisma.contest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startTime: 'desc' },
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              participations: true,
              problems: true,
            },
          },
        },
      }),
      this.prisma.contest.count({ where }),
    ]);

    return {
      contests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Update contest
  async updateContest(
    contestId: string,
    userId: string,
    updateContestDto: UpdateContestDto,
  ) {
    const contest = await this.prisma.contest.findUnique({
      where: { id: contestId },
    });

    if (!contest) {
      throw new NotFoundException('Contest not found');
    }

    if (contest.createdBy !== userId) {
      throw new ForbiddenException('You can only update your own contests');
    }

    // Check if contest has already started
    if (contest.startTime <= new Date()) {
      throw new BadRequestException(
        'Cannot update contest that has already started',
      );
    }

    return this.prisma.contest.update({
      where: { id: contestId },
      data: updateContestDto,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        problems: {
          orderBy: { order: 'asc' },
          include: {
            problem: {
              select: {
                id: true,
                title: true,
                slug: true,
                difficulty: true,
                tags: true,
              },
            },
          },
        },
      },
    });
  }

  // Delete contest
  async deleteContest(contestId: string, userId: string) {
    const contest = await this.prisma.contest.findUnique({
      where: { id: contestId },
    });

    if (!contest) {
      throw new NotFoundException('Contest not found');
    }

    if (contest.createdBy !== userId) {
      throw new ForbiddenException('You can only delete your own contests');
    }

    // Check if contest has participants
    const participantCount = await this.prisma.contestParticipation.count({
      where: { contestId },
    });

    if (participantCount > 0) {
      throw new BadRequestException('Cannot delete contest with participants');
    }

    await this.prisma.contest.delete({
      where: { id: contestId },
    });

    return { message: 'Contest deleted successfully' };
  }

  // Join contest
  async joinContest(contestId: string, userId: string) {
    const contest = await this.prisma.contest.findUnique({
      where: { id: contestId },
      include: {
        _count: {
          select: { participations: true },
        },
      },
    });

    if (!contest) {
      throw new NotFoundException('Contest not found');
    }

    // Check if contest is private
    if (contest.type === ContestType.PRIVATE) {
      throw new ForbiddenException('Cannot join private contest');
    }

    // Check if contest has ended
    if (contest.endTime < new Date()) {
      throw new BadRequestException('Contest has already ended');
    }

    // Check if user is already participating
    const existingParticipation =
      await this.prisma.contestParticipation.findUnique({
        where: {
          userId_contestId: {
            userId,
            contestId,
          },
        },
      });

    if (existingParticipation) {
      throw new BadRequestException(
        'You are already participating in this contest',
      );
    }

    // Check max participants limit
    if (
      contest.maxParticipants &&
      contest._count.participations >= contest.maxParticipants
    ) {
      throw new BadRequestException('Contest is full');
    }

    return this.prisma.contestParticipation.create({
      data: {
        userId,
        contestId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
  }

  // Leave contest
  async leaveContest(contestId: string, userId: string) {
    const participation = await this.prisma.contestParticipation.findUnique({
      where: {
        userId_contestId: {
          userId,
          contestId,
        },
      },
    });

    if (!participation) {
      throw new NotFoundException('You are not participating in this contest');
    }

    const contest = await this.prisma.contest.findUnique({
      where: { id: contestId },
    });

    // Check if contest has started
    if (contest && contest.startTime <= new Date()) {
      throw new BadRequestException(
        'Cannot leave contest that has already started',
      );
    }

    await this.prisma.contestParticipation.delete({
      where: {
        userId_contestId: {
          userId,
          contestId,
        },
      },
    });

    return { message: 'Left contest successfully' };
  }

  // Submit solution to contest problem
  async submitSolution(
    contestId: string,
    userId: string,
    submissionDto: ContestSubmissionDto,
  ) {
    const participation = await this.prisma.contestParticipation.findUnique({
      where: {
        userId_contestId: {
          userId,
          contestId,
        },
      },
    });

    if (!participation) {
      throw new ForbiddenException('You are not participating in this contest');
    }

    const contest = await this.prisma.contest.findUnique({
      where: { id: contestId },
    });

    if (!contest) {
      throw new NotFoundException('Contest not found');
    }

    // Check if contest is ongoing
    const now = new Date();
    if (now < contest.startTime || now > contest.endTime) {
      throw new BadRequestException('Contest is not currently active');
    }

    // Verify problem belongs to contest
    const contestProblem = await this.prisma.contestProblem.findUnique({
      where: {
        contestId_problemId: {
          contestId,
          problemId: submissionDto.problemId,
        },
      },
    });

    if (!contestProblem) {
      throw new BadRequestException('Problem not found in this contest');
    }

    // Create contest submission
    const submission = await this.prisma.contestSubmission.create({
      data: {
        participationId: participation.id,
        problemId: submissionDto.problemId,
        code: submissionDto.code,
        language: submissionDto.language,
        status: SubmissionStatus.PENDING,
      },
    });

    // Here you would typically integrate with a code execution service
    // For now, we'll simulate the result
    // In a real implementation, you'd call Judge0 API or similar service

    return submission;
  }

  // Get contest ranking/leaderboard
  async getContestRanking(contestId: string): Promise<ContestRankingItem[]> {
    const contest = await this.prisma.contest.findUnique({
      where: { id: contestId },
      include: {
        problems: {
          orderBy: { order: 'asc' },
          select: {
            problemId: true,
            points: true,
          },
        },
      },
    });

    if (!contest) {
      throw new NotFoundException('Contest not found');
    }

    const participations = await this.prisma.contestParticipation.findMany({
      where: { contestId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        submissions: true,
      },
      orderBy: [{ score: 'desc' }, { penalty: 'asc' }, { joinedAt: 'asc' }],
    });

    return participations.map((participation, index) => {
      const problemSubmissions = contest.problems.map((contestProblem) => {
        const userSubmissions = participation.submissions.filter(
          (sub) => sub.problemId === contestProblem.problemId,
        );

        const accepted = userSubmissions.find(
          (sub) => sub.status === SubmissionStatus.ACCEPTED,
        );

        const attempts = userSubmissions.length;
        const wrongAttempts = userSubmissions.filter(
          (sub) => sub.status !== SubmissionStatus.ACCEPTED,
        ).length;

        return {
          problemId: contestProblem.problemId,
          attempts,
          solved: !!accepted,
          penalty: accepted ? wrongAttempts * contest.penalty : 0,
          solvedAt: accepted?.submittedAt,
        };
      });

      return {
        userId: participation.user.id,
        username: participation.user.username,
        firstName: participation.user.firstName,
        lastName: participation.user.lastName,
        avatar: participation.user.avatar,
        score: participation.score,
        penalty: participation.penalty,
        rank: index + 1,
        ratingChange: participation.ratingChange,
        submissions: problemSubmissions,
      };
    });
  }

  // Get user's contest history
  async getUserContestHistory(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    const [participations, total] = await Promise.all([
      this.prisma.contestParticipation.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { joinedAt: 'desc' },
        include: {
          contest: {
            select: {
              id: true,
              title: true,
              type: true,
              startTime: true,
              endTime: true,
              duration: true,
              isRated: true,
            },
          },
        },
      }),
      this.prisma.contestParticipation.count({ where: { userId } }),
    ]);

    return {
      participations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get contest statistics
  async getContestStats(contestId: string) {
    const contest = await this.prisma.contest.findUnique({
      where: { id: contestId },
      include: {
        _count: {
          select: {
            participations: true,
            problems: true,
          },
        },
      },
    });

    if (!contest) {
      throw new NotFoundException('Contest not found');
    }

    const submissions = await this.prisma.contestSubmission.groupBy({
      by: ['status'],
      where: {
        participation: {
          contestId,
        },
      },
      _count: {
        status: true,
      },
    });

    const submissionStats = submissions.reduce(
      (acc, curr) => {
        acc[curr.status] = curr._count.status;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      contest,
      participantCount: contest._count.participations,
      problemCount: contest._count.problems,
      submissionStats,
    };
  }

  // Calculate and update contest ratings (called after contest ends)
  async updateContestRatings(contestId: string) {
    const contest = await this.prisma.contest.findUnique({
      where: { id: contestId },
    });

    if (!contest || !contest.isRated) {
      return;
    }

    // This is a simplified rating calculation
    // In a real system, you'd use ELO or similar rating system
    const participations = await this.prisma.contestParticipation.findMany({
      where: { contestId },
      include: {
        user: {
          select: {
            id: true,
            rating: true,
          },
        },
      },
      orderBy: [{ score: 'desc' }, { penalty: 'asc' }],
    });

    const updates = participations.map((participation, index) => {
      const rank = index + 1;
      const totalParticipants = participations.length;

      // Simple rating change calculation
      const expectedRank = totalParticipants / 2;
      const performance = expectedRank - rank;
      const ratingChange = Math.round(performance * 2);

      return this.prisma.$transaction([
        this.prisma.contestParticipation.update({
          where: { id: participation.id },
          data: {
            rank,
            ratingChange,
          },
        }),
        this.prisma.user.update({
          where: { id: participation.userId },
          data: {
            rating: {
              increment: ratingChange,
            },
          },
        }),
      ]);
    });

    await Promise.all(updates);
  }
}
