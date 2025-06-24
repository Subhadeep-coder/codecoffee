import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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
import { Problem, Language, Difficulty } from 'generated/prisma';

@Injectable()
export class ProblemsService {
    constructor(private prisma: PrismaService) { }

    async createProblem(
        createProblemDto: CreateProblemDto,
        userId: string,
    ): Promise<Problem> {
        const { testCases, boilerplates, ...problemData } = createProblemDto;

        // Check for duplicate title
        const existingProblem = await this.prisma.problem.findFirst({
            where: { title: problemData.title },
        });

        if (existingProblem) {
            throw new ConflictException('Problem with this title already exists');
        }

        const problem = await this.prisma.problem.create({
            data: {
                ...problemData,
                createdById: userId,
                testCases: {
                    create: testCases,
                },
                boilerplates: {
                    create: boilerplates || [],
                },
            },
            include: {
                testCases: true,
                boilerplates: true,
                createdBy: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                _count: {
                    select: {
                        reviews: true,
                        submissions: true,
                    },
                },
            },
        });

        return problem;
    }

    async findAllProblems(query: ProblemQueryDto, userId?: string) {
        const {
            search,
            difficulty,
            tags,
            page,
            limit,
            sortBy,
            sortOrder,
            isPublic,
            isApproved,
        } = query;

        const skip = (page! - 1) * limit!;

        const whereClause: any = {};

        // Public problems filter
        if (isPublic !== undefined) {
            whereClause.isPublic = isPublic;
        }

        // Approved problems filter
        if (isApproved !== undefined) {
            whereClause.isApproved = isApproved;
        }

        // If user is not authenticated, only show public and approved problems
        if (!userId) {
            whereClause.isPublic = true;
            whereClause.isApproved = true;
        }

        // Search filter
        if (search) {
            whereClause.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Difficulty filter
        if (difficulty) {
            whereClause.difficulty = difficulty;
        }

        // Tags filter
        if (tags && tags.length > 0) {
            whereClause.tags = {
                hasSome: tags,
            };
        }

        const [problems, total] = await Promise.all([
            this.prisma.problem.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: { [sortBy!]: sortOrder },
                include: {
                    createdBy: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                    _count: {
                        select: {
                            reviews: true,
                            submissions: true,
                        },
                    },
                },
            }),
            this.prisma.problem.count({ where: whereClause }),
        ]);

        return {
            problems,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit!),
            },
        };
    }

    async findProblemById(id: string, userId?: string): Promise<Problem> {
        const problem = await this.prisma.problem.findUnique({
            where: { id },
            include: {
                testCases: {
                    select: {
                        id: true,
                        input: true,
                        output: true,
                        isHidden: true,
                        points: true,
                    },
                },
                boilerplates: true,
                createdBy: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
                _count: {
                    select: {
                        reviews: true,
                        submissions: true,
                    },
                },
            },
        });

        if (!problem) {
            throw new NotFoundException('Problem not found');
        }

        // Check permissions
        const canAccess =
            problem.isPublic && problem.isApproved ||
            problem.createdById === userId ||
            !userId === false; // Admin check would go here

        if (!canAccess) {
            throw new ForbiddenException('Access denied to this problem');
        }

        // Hide test case outputs for non-owners (except sample cases)
        if (problem.createdById !== userId) {
            problem.testCases = problem.testCases.map((testCase) => ({
                ...testCase,
                output: testCase.isHidden ? 'Hidden' : testCase.output,
            }));
        }

        return problem;
    }

    async updateProblem(
        id: string,
        updateProblemDto: UpdateProblemDto,
        userId: string,
    ): Promise<Problem> {
        const problem = await this.prisma.problem.findUnique({
            where: { id },
        });

        if (!problem) {
            throw new NotFoundException('Problem not found');
        }

        if (problem.createdById !== userId) {
            throw new ForbiddenException('You can only update your own problems');
        }

        const updatedProblem = await this.prisma.problem.update({
            where: { id },
            data: updateProblemDto,
            include: {
                testCases: true,
                boilerplates: true,
                createdBy: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        return updatedProblem;
    }

    async deleteProblem(id: string, userId: string): Promise<void> {
        const problem = await this.prisma.problem.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        submissions: true,
                    },
                },
            },
        });

        if (!problem) {
            throw new NotFoundException('Problem not found');
        }

        if (problem.createdById !== userId) {
            throw new ForbiddenException('You can only delete your own problems');
        }

        if (problem._count.submissions > 0) {
            throw new BadRequestException(
                'Cannot delete problem with existing submissions',
            );
        }

        await this.prisma.problem.delete({
            where: { id },
        });
    }

    // Test Cases Management
    async addTestCase(
        problemId: string,
        createTestCaseDto: CreateTestCaseDto,
        userId: string,
    ) {
        const problem = await this.prisma.problem.findUnique({
            where: { id: problemId },
        });

        if (!problem) {
            throw new NotFoundException('Problem not found');
        }

        if (problem.createdById !== userId) {
            throw new ForbiddenException('You can only modify your own problems');
        }

        return this.prisma.testCase.create({
            data: {
                ...createTestCaseDto,
                problemId,
            },
        });
    }

    async updateTestCase(
        testCaseId: string,
        updateTestCaseDto: UpdateTestCaseDto,
        userId: string,
    ) {
        const testCase = await this.prisma.testCase.findUnique({
            where: { id: testCaseId },
            include: { problem: true },
        });

        if (!testCase) {
            throw new NotFoundException('Test case not found');
        }

        if (testCase.problem.createdById !== userId) {
            throw new ForbiddenException('You can only modify your own problems');
        }

        return this.prisma.testCase.update({
            where: { id: testCaseId },
            data: updateTestCaseDto,
        });
    }

    async deleteTestCase(testCaseId: string, userId: string) {
        const testCase = await this.prisma.testCase.findUnique({
            where: { id: testCaseId },
            include: { problem: true },
        });

        if (!testCase) {
            throw new NotFoundException('Test case not found');
        }

        if (testCase.problem.createdById !== userId) {
            throw new ForbiddenException('You can only modify your own problems');
        }

        // Check if it's the last test case
        const testCaseCount = await this.prisma.testCase.count({
            where: { problemId: testCase.problemId },
        });

        if (testCaseCount <= 1) {
            throw new BadRequestException('Cannot delete the last test case');
        }

        await this.prisma.testCase.delete({
            where: { id: testCaseId },
        });
    }

    // Boilerplates Management
    async addBoilerplate(
        problemId: string,
        createBoilerplateDto: CreateBoilerplateDto,
        userId: string,
    ) {
        const problem = await this.prisma.problem.findUnique({
            where: { id: problemId },
        });

        if (!problem) {
            throw new NotFoundException('Problem not found');
        }

        if (problem.createdById !== userId) {
            throw new ForbiddenException('You can only modify your own problems');
        }

        // Check if boilerplate already exists for this language
        const existingBoilerplate = await this.prisma.boilerplate.findUnique({
            where: {
                problemId_language: {
                    problemId,
                    language: createBoilerplateDto.language,
                },
            },
        });

        if (existingBoilerplate) {
            throw new ConflictException(
                `Boilerplate for ${createBoilerplateDto.language} already exists`,
            );
        }

        return this.prisma.boilerplate.create({
            data: {
                ...createBoilerplateDto,
                problemId,
            },
        });
    }

    async updateBoilerplate(
        problemId: string,
        language: Language,
        updateBoilerplateDto: UpdateBoilerplateDto,
        userId: string,
    ) {
        const boilerplate = await this.prisma.boilerplate.findUnique({
            where: {
                problemId_language: {
                    problemId,
                    language,
                },
            },
            include: { problem: true },
        });

        if (!boilerplate) {
            throw new NotFoundException('Boilerplate not found');
        }

        if (boilerplate.problem.createdById !== userId) {
            throw new ForbiddenException('You can only modify your own problems');
        }

        return this.prisma.boilerplate.update({
            where: {
                problemId_language: {
                    problemId,
                    language,
                },
            },
            data: updateBoilerplateDto,
        });
    }

    async deleteBoilerplate(
        problemId: string,
        language: Language,
        userId: string,
    ) {
        const boilerplate = await this.prisma.boilerplate.findUnique({
            where: {
                problemId_language: {
                    problemId,
                    language,
                },
            },
            include: { problem: true },
        });

        if (!boilerplate) {
            throw new NotFoundException('Boilerplate not found');
        }

        if (boilerplate.problem.createdById !== userId) {
            throw new ForbiddenException('You can only modify your own problems');
        }

        await this.prisma.boilerplate.delete({
            where: {
                problemId_language: {
                    problemId,
                    language,
                },
            },
        });
    }

    // Reviews Management
    async createReview(
        problemId: string,
        createReviewDto: CreateReviewDto,
        userId: string,
    ) {
        const problem = await this.prisma.problem.findUnique({
            where: { id: problemId },
        });

        if (!problem) {
            throw new NotFoundException('Problem not found');
        }

        if (!problem.isPublic || !problem.isApproved) {
            throw new ForbiddenException('Cannot review non-public problems');
        }

        if (problem.createdById === userId) {
            throw new ForbiddenException('Cannot review your own problem');
        }

        // Check if user already reviewed this problem
        const existingReview = await this.prisma.problemReview.findUnique({
            where: {
                problemId_userId: {
                    problemId,
                    userId,
                },
            },
        });

        if (existingReview) {
            throw new ConflictException('You have already reviewed this problem');
        }

        return this.prisma.problemReview.create({
            data: {
                ...createReviewDto,
                problemId,
                userId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
    }

    async updateReview(
        problemId: string,
        updateReviewDto: UpdateReviewDto,
        userId: string,
    ) {
        const review = await this.prisma.problemReview.findUnique({
            where: {
                problemId_userId: {
                    problemId,
                    userId,
                },
            },
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        return this.prisma.problemReview.update({
            where: {
                problemId_userId: {
                    problemId,
                    userId,
                },
            },
            data: updateReviewDto,
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
    }

    async deleteReview(problemId: string, userId: string) {
        const review = await this.prisma.problemReview.findUnique({
            where: {
                problemId_userId: {
                    problemId,
                    userId,
                },
            },
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        await this.prisma.problemReview.delete({
            where: {
                problemId_userId: {
                    problemId,
                    userId,
                },
            },
        });
    }

    async getProblemReviews(problemId: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [reviews, total] = await Promise.all([
            this.prisma.problemReview.findMany({
                where: { problemId },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            }),
            this.prisma.problemReview.count({
                where: { problemId },
            }),
        ]);

        return {
            reviews,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    // Utility methods
    async getPopularTags(): Promise<string[]> {
        const problems = await this.prisma.problem.findMany({
            where: {
                isPublic: true,
                isApproved: true,
            },
            select: { tags: true },
        });

        const tagCounts = new Map<string, number>();
        problems.forEach((problem) => {
            problem.tags.forEach((tag) => {
                tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
            });
        });

        return Array.from(tagCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20)
            .map((entry) => entry[0]);
    }

    async getProblemStats() {
        const [total, byDifficulty, byStatus] = await Promise.all([
            this.prisma.problem.count(),
            this.prisma.problem.groupBy({
                by: ['difficulty'],
                _count: {
                    id: true,
                },
            }),
            this.prisma.problem.groupBy({
                by: ['isPublic', 'isApproved'],
                _count: {
                    id: true,
                },
            }),
        ]);

        return {
            total,
            byDifficulty: byDifficulty.reduce((acc, item) => {
                acc[item.difficulty] = item._count.id;
                return acc;
            }, {} as Record<Difficulty, number>),
            byStatus: byStatus.reduce((acc, item) => {
                const key = item.isPublic && item.isApproved ? 'published' :
                    item.isPublic ? 'pending' : 'draft';
                acc[key] = (acc[key] || 0) + item._count.id;
                return acc;
            }, {} as Record<string, number>),
        };
    }
}