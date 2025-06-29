import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProblemsService {
    constructor(private prisma: PrismaService) { }

    async getProblems(getProblemsDto: any) {
        const {
            page = 1,
            limit = 20,
            difficulty,
            tags,
            search,
            company,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            showPremium = true
        } = getProblemsDto;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const where = {
            isPublished: true,
            ...(showPremium === 'false' && { isPremium: false }),
            ...(difficulty && { difficulty: difficulty.toUpperCase() }),
            ...(search && {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } }
                ]
            })
        };

        if (tags) {
            const tagArray = tags.split(',');
            where.tags = {
                hasSome: tagArray
            };
        }

        if (company) {
            where.companies = {
                has: company
            };
        }

        const problems = await this.prisma.problem.findMany({
            where,
            include: {
                creator: {
                    select: { id: true, username: true, firstName: true, lastName: true }
                },
                _count: {
                    select: {
                        submissions: true,
                        discussions: true,
                        bookmarks: true
                    }
                }
            },
            orderBy: { [sortBy]: sortOrder },
            skip,
            take: parseInt(limit)
        });

        const total = await this.prisma.problem.count({ where });

        return {
            problems,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
        }
    }

    async getProblemById(slug: string) {

        const problem = await this.prisma.problem.findUnique({
            where: { slug: slug },
            include: {
                creator: {
                    select: { id: true, username: true, firstName: true, lastName: true }
                },
                testCases: {
                    where: { isHidden: false }, // Only return sample test cases
                    select: { input: true, expectedOutput: true, explanation: true }
                },
                _count: {
                    select: {
                        submissions: true,
                        discussions: true,
                        bookmarks: true
                    }
                }
            }
        });

        if (!problem) {
            throw new NotFoundException("Problem not found");
        }

        if (!problem.isPublished) {
            throw new NotFoundException('Problem not published');
        }

        return problem;
    }


    async createProblem(userId: string, createProblemDto: any) {
        const {
            title,
            description,
            difficulty,
            tags = [],
            constraints,
            hints = [],
            companies = [],
            testCases = [],
            isPremium = false
        } = createProblemDto;

        // Validate required fields
        if (!title || !description || !difficulty) {
            throw new NotFoundException('Title, description, and difficulty are required');
        }

        // Generate slug from title
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

        // Check if slug already exists
        const existingProblem = await this.prisma.problem.findUnique({ where: { slug } });
        if (existingProblem) {
            throw new NotFoundException('Problem with this title already exists');
        }

        const problem = await this.prisma.problem.create({
            data: {
                title,
                slug,
                description,
                difficulty: difficulty.toUpperCase(),
                tags,
                constraints,
                hints,
                companies,
                isPremium,
                createdBy: userId,
                testCases: {
                    create: testCases.map(tc => ({
                        input: tc.input,
                        expectedOutput: tc.expectedOutput,
                        isHidden: tc.isHidden || false,
                        explanation: tc.explanation
                    }))
                }
            },
            include: {
                creator: {
                    select: { id: true, username: true, firstName: true, lastName: true }
                },
                testCases: true
            }
        });

        return problem;
    }


    async updateProblem(userId: string, problemId: string, updatedProblemDto: any) {
        const {
            title,
            description,
            difficulty,
            tags,
            constraints,
            hints,
            companies,
            isPremium,
            isPublished,
            testCases
        } = updatedProblemDto;

        // Check if problem exists and user owns it
        const existingProblem = await this.prisma.problem.findUnique({
            where: { id: problemId },
            include: { testCases: true }
        });

        if (!existingProblem) {
            throw new NotFoundException('Problem not found');
        }

        if (existingProblem.createdBy !== userId) {
            throw new NotFoundException('Not authorized to update this problem');
        }

        // Update slug if title changed
        let slug = existingProblem.slug;
        if (title && title !== existingProblem.title) {
            slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        }

        const updatedProblem = await this.prisma.problem.update({
            where: { id: problemId },
            data: {
                ...(title && { title, slug }),
                ...(description && { description }),
                ...(difficulty && { difficulty: difficulty.toUpperCase() }),
                ...(tags && { tags }),
                ...(constraints !== undefined && { constraints }),
                ...(hints && { hints }),
                ...(companies && { companies }),
                ...(isPremium !== undefined && { isPremium }),
                ...(isPublished !== undefined && { isPublished }),
                ...(testCases && {
                    testCases: {
                        deleteMany: {},
                        create: testCases.map(tc => ({
                            input: tc.input,
                            expectedOutput: tc.expectedOutput,
                            isHidden: tc.isHidden || false,
                            explanation: tc.explanation
                        }))
                    }
                })
            },
            include: {
                creator: {
                    select: { id: true, username: true, firstName: true, lastName: true }
                },
                testCases: true
            }
        });

        return updatedProblem;
    }

    async deleteProblem(userId: string, problemId: string) {

        const problem = await this.prisma.problem.findUnique({
            where: { id: problemId }
        });

        if (!problem) {
            throw new NotFoundException('Problem not found');
        }

        if (problem.createdBy !== userId) {
            throw new NotFoundException('Not authorized to delete this problem');
        }

        await this.prisma.problem.delete({
            where: { id: problemId }
        });

        return { message: 'Problem deleted successfully' }
    }
}