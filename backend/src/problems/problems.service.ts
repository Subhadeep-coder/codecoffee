import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProblemsDto, GetProblemsDto } from './dto';
import { Difficulty, Prisma } from '@prisma/client';

@Injectable()
export class ProblemsService {
  constructor(private prisma: PrismaService) {}

  async getProblems(getProblemsDto: GetProblemsDto) {
    const {
      page = '1',
      limit = '20',
      difficulty,
      tags,
      search,
      company,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      showPremium = 'true',
    } = getProblemsDto;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const whereInput = Prisma.validator<Prisma.ProblemWhereInput>()({
      isPublished: true,
      ...(showPremium === 'false' && { isPremium: false }),
      ...(difficulty && { difficulty: difficulty.toUpperCase() as any }),
      ...(search && {
        OR: [
          {
            title: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            description: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      }),
      ...(tags && {
        tags: {
          hasSome: tags.split(',').map((tag) => tag.trim()),
        },
      }),
      ...(company && {
        companies: {
          has: company,
        },
      }),
    });

    const orderByInput =
      Prisma.validator<Prisma.ProblemOrderByWithRelationInput>()({
        [sortBy]: sortOrder as Prisma.SortOrder,
      });

    try {
      const [problems, total] = await Promise.all([
        this.prisma.problem.findMany({
          where: whereInput,
          include: {
            creator: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
            _count: {
              select: {
                submissions: true,
                discussions: true,
                bookmarks: true,
              },
            },
          },
          orderBy: orderByInput,
          skip,
          take: parseInt(limit),
        }),
        this.prisma.problem.count({ where: whereInput }),
      ]);

      console.log('Where clause: ', whereInput);

      return {
        problems,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
        hasNextPage: skip + parseInt(limit) < total,
        hasPreviousPage: parseInt(page) > 1,
      };
    } catch (error) {
      console.error('Error fetching problems:', error);
      throw new Error('Failed to fetch problems');
    }
  }

  async getProblemById(slug: string) {
    console.log('Slug: ', slug);
    const problem = await this.prisma.problem.findUnique({
      where: { slug: slug },
      include: {
        creator: {
          select: { id: true, username: true, firstName: true, lastName: true },
        },
        testCases: {
          where: { isHidden: false }, // Only return sample test cases
          select: { input: true, expectedOutput: true, explanation: true },
        },
        problemTemplate: true,
        inputFormat: true,
        _count: {
          select: {
            submissions: true,
            discussions: true,
            bookmarks: true,
          },
        },
      },
    });

    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    if (!problem.isPublished) {
      throw new NotFoundException('Problem not published');
    }

    // Decode base64 templates
    // const decodedProblem = {
    //   ...problem,
    //   problemTemplate: problem.problemTemplate.map((template) => ({
    //     ...template,
    //     template: Buffer.from(template.template, 'base64').toString('utf-8'),
    //   })),
    // };

    return problem;
  }

  async createProblem(userId: string, createProblemDto: CreateProblemsDto) {
    const {
      title,
      description,
      difficulty,
      tags = [],
      constraints,
      hints = [],
      companies = [],
      testCases = [],
      isPremium = false,
      problemTemplates = [],
      inputFormats = [],
      outputFormats = [],
    } = createProblemDto;

    if (!title || !description || !difficulty) {
      throw new NotFoundException(
        'Title, description, and difficulty are required',
      );
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const existingProblem = await this.prisma.problem.findUnique({
      where: { slug },
    });
    if (existingProblem) {
      throw new NotFoundException('Problem with this title already exists');
    }

    // Encode templates to base64
    const encodedTemplates = problemTemplates.map((template) => ({
      ...template,
      template: Buffer.from(template.template).toString('base64'),
    }));

    // Build data object conditionally
    const data: any = {
      title,
      slug,
      description,
      difficulty: difficulty.toUpperCase() as Difficulty,
      tags,
      constraints,
      hints,
      companies,
      isPremium,
      createdBy: userId,
      testCases: {
        create: testCases.map((tc) => ({
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          isHidden: tc.isHidden || false,
          explanation: tc.explanation,
        })),
      },
      problemTemplate: {
        create: encodedTemplates,
      },
    };

    console.log('Input Format: ', inputFormats);
    console.log('Output Format: ', outputFormats);

    // Fix: Check if arrays have actual valid objects, not just length
    if (
      inputFormats &&
      inputFormats.length > 0 &&
      inputFormats.every((format) => format.formatType && format.parseMethod)
    ) {
      data.inputFormat = { create: inputFormats };
    }
    if (
      outputFormats &&
      outputFormats.length > 0 &&
      outputFormats.every((format) => format.formatType && format.parseMethod)
    ) {
      data.outputFormat = { create: outputFormats };
    }

    const problem = await this.prisma.problem.create({
      data,
      include: {
        creator: {
          select: { id: true, username: true, firstName: true, lastName: true },
        },
        testCases: true,
        problemTemplate: true,
        inputFormat: true,
        outputFormat: true,
      },
    });

    // Decode templates for response
    const decodedProblem = {
      ...problem,
      problemTemplate: problem.problemTemplate.map((template) => ({
        ...template,
        template: Buffer.from(template.template, 'base64').toString('utf-8'),
      })),
    };

    return decodedProblem;
  }

  async updateProblem(
    userId: string,
    problemId: string,
    updatedProblemDto: any,
  ) {
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
      testCases,
      problemTemplates,
      inputFormats,
    } = updatedProblemDto;

    // Check if problem exists and user owns it
    const existingProblem = await this.prisma.problem.findUnique({
      where: { id: problemId },
      include: {
        testCases: true,
        problemTemplate: true,
        inputFormat: true,
      },
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
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }

    // Encode templates to base64 if provided
    const encodedTemplates = problemTemplates
      ? problemTemplates.map((template) => ({
          ...template,
          template: Buffer.from(template.template).toString('base64'),
        }))
      : undefined;

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
            create: testCases.map((tc) => ({
              input: tc.input,
              expectedOutput: tc.expectedOutput,
              isHidden: tc.isHidden || false,
              explanation: tc.explanation,
            })),
          },
        }),
        ...(encodedTemplates && {
          problemTemplate: {
            deleteMany: {},
            create: encodedTemplates,
          },
        }),
        ...(inputFormats && {
          inputFormat: {
            deleteMany: {},
            create: inputFormats,
          },
        }),
      },
      include: {
        creator: {
          select: { id: true, username: true, firstName: true, lastName: true },
        },
        testCases: true,
        problemTemplate: true,
        inputFormat: true,
      },
    });

    // Decode templates for response
    const decodedProblem = {
      ...updatedProblem,
      problemTemplate: updatedProblem.problemTemplate.map((template) => ({
        ...template,
        template: Buffer.from(template.template, 'base64').toString('utf-8'),
      })),
    };

    return decodedProblem;
  }

  async deleteProblem(userId: string, problemId: string) {
    const problem = await this.prisma.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    if (problem.createdBy !== userId) {
      throw new NotFoundException('Not authorized to delete this problem');
    }

    await this.prisma.problem.delete({
      where: { id: problemId },
    });

    return { message: 'Problem deleted successfully' };
  }
}
