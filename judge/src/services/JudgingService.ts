import { PrismaClient, SubmissionStatus } from "@prisma/client";
import { SubmissionQueue } from "../queue/SubmissionQueue";
import { ExecutorFactory } from "../executors/ExecutorFactory";
import {
  SubmissionRequest,
  JudgeResult,
  TestCaseResult,
  TestCase,
} from "../types";
import { InputParsers, InputFormatType } from "../parsers/InputParsers";
import { OutputValidators } from "../parsers/OutputValidators";
import { OutputParsers } from "../parsers/OutputParsers";

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

      if (!problemTemplate) {
        throw new Error(
          `No template found for language: ${submission.language}`,
        );
      }
      if (!problem) {
        throw new Error(`Problem not found`);
      }

      // Get test cases for the problem
      const testCases = await this.prisma.testCase.findMany({
        where: { problemId: submission.problemId },
        orderBy: { id: "asc" },
      });
      if (testCases.length === 0) {
        throw new Error("No test cases found for this problem");
      }
      console.log("Testcases: ", testCases);
      // Validate language support
      if (
        !ExecutorFactory.getSupportedLanguages().includes(
          submission.language.toLowerCase(),
        )
      ) {
        throw new Error(`Unsupported language: ${submission.language}`);
      }

      // Prepare code: concatenate user code with template
      // const wrappedCode = TemplateManager.getTemplate(submission.language, {
      //   ...problemTemplate,
      //   userCode: submission.code,
      // });

      // Get executor for the language
      const executor = ExecutorFactory.getExecutor(submission.language);

      // Process each test case
      const testCaseResults: TestCaseResult[] = [];
      let totalRuntime = 0;
      let maxMemory = 0;
      let passedCount = 0;
      let shouldStopOnError = true; // Stop on first error for efficiency

      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        // Parse input and expected output
        // let parsedInput: any, parsedExpected: any;
        try {
          // parsedInput = InputParsers.parse(
          //   testCase.input,
          //   inputFormat.formatType as InputFormatType,
          // );
          // parsedExpected = OutputParsers.parse(
          //   testCase.expectedOutput,
          //   outputFormat.formatType as InputFormatType,
          // );
        } catch (e) {
          console.error("Parsing error:", e);
          throw new Error(
            `Input/Output parsing failed: ${e instanceof Error ? e.message : String(e)}`,
          );
        }

        // console.log("Parsed Input: ", parsedInput);
        // console.log("Parsed Output: ", parsedExpected);
        // Prepare testCaseInput for executor
        const testCaseInput: TestCase = {
          id: testCase.id,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          timeLimit: 2000,
          memoryLimit: 256,
          isHidden: testCase.isHidden || false,
          weight: 1,
        };

        // Execute code
        const result = await executor.executeCode(
          submission.code,
          testCaseInput,
        );

        console.log("After Code Execution, Result: ", result);
        // Validate output
        let isCorrect = false;
        if (result.status === "ACCEPTED" && result.output !== undefined) {
          isCorrect = OutputValidators.validate(
            result.output,
            // OutputParsers.parse(
            //   result.output,
            //   outputFormat.formatType as InputFormatType,
            // ),
            testCase.expectedOutput,
          );
          console.log("isCorrect: ", isCorrect);
        }

        const testCaseResult: TestCaseResult = {
          testCaseId: testCase.id,
          status: isCorrect ? "ACCEPTED" : result.status,
          runtime: result.runtime,
          memory: result.memory,
          input: testCase.isHidden ? "[Hidden]" : testCase.input,
          expectedOutput: testCase.isHidden
            ? "[Hidden]"
            : testCase.expectedOutput,
          actualOutput:
            testCase.isHidden && !isCorrect ? "[Hidden]" : result.output,
          errorMessage: result.errorMessage,
        };
        testCaseResults.push(testCaseResult);
        if (isCorrect) passedCount++;
        if (result.runtime) totalRuntime += result.runtime;
        if (result.memory) maxMemory = Math.max(maxMemory, result.memory);
        if (shouldStopOnError && !isCorrect) break;
      }

      // Determine overall status
      let overallStatus: string;
      if (passedCount === testCases.length) {
        overallStatus = "ACCEPTED";
      } else {
        const failedResult = testCaseResults.find(
          (r) => r.status !== "ACCEPTED",
        );
        overallStatus = failedResult?.status || "WRONG_ANSWER";
      }

      const judgeResult: JudgeResult = {
        submissionId: submission.id,
        status: overallStatus,
        testCasesPassed: passedCount,
        totalTestCases: testCases.length,
        runtime:
          testCaseResults.length > 0 && totalRuntime > 0
            ? Math.floor(totalRuntime / testCaseResults.length)
            : undefined,
        memory: maxMemory > 0 ? maxMemory : undefined,
        testCaseResults,
      };

      // Update submission in database
      await this.updateSubmissionResult(judgeResult);

      console.log(
        `Completed submission ${submission.id} with status ${judgeResult.status}`,
      );
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
