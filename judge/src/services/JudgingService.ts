import { PrismaClient, SubmissionStatus } from "@prisma/client";
import { SubmissionQueue } from "../queue/SubmissionQueue";
import { ExecutorFactory } from "../executors/ExecutorFactory";
import {
  SubmissionRequest,
  JudgeResult,
  TestCaseResult,
  TestCase,
} from "../types";

export class JudgingService {
  private prisma: PrismaClient;
  private queue: SubmissionQueue;

  constructor() {
    this.prisma = new PrismaClient();
    this.queue = new SubmissionQueue();
  }

  async processSubmission(submission: SubmissionRequest): Promise<JudgeResult> {
    try {
      console.log(`Processing submission ${submission.id}`);

      // Update submission status to processing
      await this.prisma.submission.update({
        where: { id: submission.id },
        data: { status: SubmissionStatus.PENDING },
      });

      // Get test cases based on mode
      const testCases = await this.prisma.testCase.findMany({
        where: {
          problemId: submission.problemId,
          ...(submission.mode === 'run' && { isHidden: false }), // Only visible test cases for run mode
        },
        orderBy: { id: "asc" },
      });

      if (testCases.length === 0) {
        throw new Error("No test cases found for this problem");
      }

      // Get problem template and input format
      const [problemTemplate, problem] = await Promise.all([
        this.prisma.problemTemplate.findUnique({
          where: {
            problemId_language: {
              problemId: submission.problemId,
              language: submission.language.toLowerCase(),
            },
          },
        }),
        this.prisma.problem.findUnique({
          where: { id: submission.problemId },
        }),
      ]);

      // Validate language support
      if (!ExecutorFactory.getSupportedLanguages().includes(submission.language.toLowerCase())) {
        throw new Error(`Unsupported language: ${submission.language}`);
      }

      // Get executor for the language
      const executor = ExecutorFactory.getExecutor(submission.language);

      // Process each test case
      const testCaseResults: TestCaseResult[] = [];
      let totalRuntime = 0;
      let maxMemory = 0;
      let passedCount = 0;

      // Execute all test cases regardless of failures
      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`Running test case ${i + 1}/${testCases.length} for submission ${submission.id}`);

        const testCaseInput: TestCase = {
          id: testCase.id,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          timeLimit: 2000,
          memoryLimit: 256,
          isHidden: testCase.isHidden || false,
          weight: 1,
        };

        const result = await executor.executeCode(submission.code, testCaseInput);

        const testCaseResult: TestCaseResult = {
          testCaseId: testCase.id,
          status: result.status,
          runtime: result.runtime,
          memory: result.memory,
          input: testCase.isHidden ? "[Hidden]" : testCase.input,
          expectedOutput: testCase.isHidden ? "[Hidden]" : testCase.expectedOutput,
          actualOutput: testCase.isHidden && result.status !== "ACCEPTED" ? "[Hidden]" : result.output,
          errorMessage: result.errorMessage,
        };

        testCaseResults.push(testCaseResult);

        if (result.status === "ACCEPTED") {
          passedCount++;
        }

        // Accumulate statistics
        if (result.runtime) totalRuntime += result.runtime;
        if (result.memory) maxMemory = Math.max(maxMemory, result.memory);
      }

      // Determine overall status
      const overallStatus = passedCount === testCases.length ? "ACCEPTED" : "WRONG_ANSWER";

      const judgeResult: JudgeResult = {
        submissionId: submission.id,
        status: overallStatus,
        testCasesPassed: passedCount,
        totalTestCases: testCases.length,
        runtime: testCaseResults.length > 0 ? Math.floor(totalRuntime / testCaseResults.length) : undefined,
        memory: maxMemory > 0 ? maxMemory : undefined,
        testCaseResults,
      };

      // Update submission in database
      await this.updateSubmissionResult(judgeResult);

      console.log(`Completed submission ${submission.id} with status ${judgeResult.status}`);
      return judgeResult;
    } catch (error) {
      console.error(`Error processing submission ${submission.id}:`, error);
      const errorResult: JudgeResult = {
        submissionId: submission.id,
        status: "INTERNAL_ERROR",
        testCasesPassed: 0,
        totalTestCases: 0,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        testCaseResults: [],
      };
      await this.updateSubmissionResult(errorResult);
      return errorResult;
    }
  }

  private async updateSubmissionResult(result: JudgeResult): Promise<void> {
    try {
      await this.prisma.submission.update({
        where: { id: result.submissionId },
        data: {
          status: result.status as any,
          testCasesPassed: result.testCasesPassed,
          totalTestCases: result.totalTestCases,
          runtime: result.runtime,
          memory: result.memory,
          errorMessage: result.errorMessage,
        },
      });
    } catch (error) {
      console.error("Failed to update submission result:", error);
    }
  }

  async getSubmissionResult(submissionId: string): Promise<JudgeResult | null> {
    try {
      const submission = await this.prisma.submission.findUnique({
        where: { id: submissionId },
        include: {
          problem: {
            select: { title: true, difficulty: true },
          },
        },
      });

      if (!submission) {
        return null;
      }

      // For now, return basic result. You can extend this to include test case details
      return {
        submissionId: submission.id,
        status: submission.status,
        testCasesPassed: submission.testCasesPassed || 0,
        totalTestCases: submission.totalTestCases || 0,
        runtime: submission.runtime!,
        memory: submission.memory!,
        errorMessage: submission.errorMessage!,
        testCaseResults: [], // You might want to store and retrieve detailed results
      };
    } catch (error) {
      console.error("Error fetching submission result:", error);
      return null;
    }
  }
}
