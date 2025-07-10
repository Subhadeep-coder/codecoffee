import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';

@Injectable()
export class SubmissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createSubmission(
    userId: string,
    createSubmissionDto: CreateSubmissionDto,
  ) {
    // Build the body dynamically from the DTO
    const { problemId, code, language } = createSubmissionDto;
    const soucreCode = Buffer.from(code, 'base64').toString('utf-8');
    const response = await fetch('http://localhost:9000/submission', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        problemId,
        code: soucreCode,
        language,
        userId,
      }),
    });

    console.log('Response: ', response);
    const result = await response.json();
    console.log('After submission: ', result);
    return result;
  }

  async getSubmissionStatus(submissionId: string) {
    const response = await fetch(
      `http://localhost:9000/submission/${submissionId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const result = await response.json();
    console.log('After getting submission status: ', result);
    return result;
  }

  async getSubmissions(userId: string, problemId: string) {
    const submissions = await this.prisma.submission.findMany({
      where: {
        AND: [{ userId: userId }, { problemId: problemId }],
      },
      omit: {
        code: true,
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    return submissions;
  }
}
