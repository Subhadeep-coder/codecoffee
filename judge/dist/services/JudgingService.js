"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JudgingService = void 0;
const client_1 = require("@prisma/client");
const SubmissionQueue_1 = require("../queue/SubmissionQueue");
const ExecutorFactory_1 = require("../executors/ExecutorFactory");
const OutputValidators_1 = require("../parsers/OutputValidators");
class JudgingService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
        this.queue = new SubmissionQueue_1.SubmissionQueue();
    }
    processSubmission(submission) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`Processing submission ${submission.id}`);
                // Update submission status to processing
                yield this.prisma.submission.update({
                    where: { id: submission.id },
                    data: { status: client_1.SubmissionStatus.PENDING },
                });
                // Get problem template and input format
                const [problemTemplate, inputFormat, outputFormat, problem] = yield Promise.all([
                    this.prisma.problemTemplate.findUnique({
                        where: {
                            problemId_language: {
                                problemId: submission.problemId,
                                language: submission.language.toLowerCase(),
                            },
                        },
                    }),
                    this.prisma.inputFormat.findFirst({
                        where: { problemId: submission.problemId },
                    }),
                    this.prisma.outputFormat.findFirst({
                        where: { problemId: submission.problemId },
                    }),
                    this.prisma.problem.findUnique({
                        where: { id: submission.problemId },
                    }),
                ]);
                if (!problemTemplate) {
                    throw new Error(`No template found for language: ${submission.language}`);
                }
                if (!inputFormat) {
                    throw new Error(`No input format found for this problem`);
                }
                if (!outputFormat) {
                    throw new Error(`No output format found for this problem`);
                }
                if (!problem) {
                    throw new Error(`Problem not found`);
                }
                // Get test cases for the problem
                const testCases = yield this.prisma.testCase.findMany({
                    where: { problemId: submission.problemId },
                    orderBy: { id: "asc" },
                });
                if (testCases.length === 0) {
                    throw new Error("No test cases found for this problem");
                }
                console.log("Testcases: ", testCases);
                // Validate language support
                if (!ExecutorFactory_1.ExecutorFactory.getSupportedLanguages().includes(submission.language.toLowerCase())) {
                    throw new Error(`Unsupported language: ${submission.language}`);
                }
                // Prepare code: concatenate user code with template
                // const wrappedCode = TemplateManager.getTemplate(submission.language, {
                //   ...problemTemplate,
                //   userCode: submission.code,
                // });
                // Get executor for the language
                const executor = ExecutorFactory_1.ExecutorFactory.getExecutor(submission.language);
                // Process each test case
                const testCaseResults = [];
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
                    }
                    catch (e) {
                        console.error("Parsing error:", e);
                        throw new Error(`Input/Output parsing failed: ${e instanceof Error ? e.message : String(e)}`);
                    }
                    // console.log("Parsed Input: ", parsedInput);
                    // console.log("Parsed Output: ", parsedExpected);
                    // Prepare testCaseInput for executor
                    const testCaseInput = {
                        id: testCase.id,
                        input: testCase.input,
                        expectedOutput: testCase.expectedOutput,
                        timeLimit: 2000,
                        memoryLimit: 256,
                        isHidden: testCase.isHidden || false,
                        weight: 1,
                    };
                    console.log("Before Code Execution");
                    // Execute code
                    const result = yield executor.executeCode(submission.code, testCaseInput);
                    console.log("After Code Execution, Result: ", result);
                    // Validate output
                    let isCorrect = false;
                    if (result.status === "ACCEPTED" && result.output !== undefined) {
                        isCorrect = OutputValidators_1.OutputValidators.validate(result.output, 
                        // OutputParsers.parse(
                        //   result.output,
                        //   outputFormat.formatType as InputFormatType,
                        // ),
                        testCase.expectedOutput, outputFormat.formatType);
                        console.log("isCorrect: ", isCorrect);
                    }
                    const testCaseResult = {
                        testCaseId: testCase.id,
                        status: isCorrect ? "ACCEPTED" : result.status,
                        runtime: result.runtime,
                        memory: result.memory,
                        input: testCase.isHidden ? "[Hidden]" : testCase.input,
                        expectedOutput: testCase.isHidden
                            ? "[Hidden]"
                            : testCase.expectedOutput,
                        actualOutput: testCase.isHidden && !isCorrect ? "[Hidden]" : result.output,
                        errorMessage: result.errorMessage,
                    };
                    testCaseResults.push(testCaseResult);
                    if (isCorrect)
                        passedCount++;
                    if (result.runtime)
                        totalRuntime += result.runtime;
                    if (result.memory)
                        maxMemory = Math.max(maxMemory, result.memory);
                    if (shouldStopOnError && !isCorrect)
                        break;
                }
                // Determine overall status
                let overallStatus;
                if (passedCount === testCases.length) {
                    overallStatus = "ACCEPTED";
                }
                else {
                    const failedResult = testCaseResults.find((r) => r.status !== "ACCEPTED");
                    overallStatus = (failedResult === null || failedResult === void 0 ? void 0 : failedResult.status) || "WRONG_ANSWER";
                }
                const judgeResult = {
                    submissionId: submission.id,
                    status: overallStatus,
                    testCasesPassed: passedCount,
                    totalTestCases: testCases.length,
                    runtime: testCaseResults.length > 0 && totalRuntime > 0
                        ? Math.floor(totalRuntime / testCaseResults.length)
                        : undefined,
                    memory: maxMemory > 0 ? maxMemory : undefined,
                    testCaseResults,
                };
                // Update submission in database
                yield this.updateSubmissionResult(judgeResult);
                console.log(`Completed submission ${submission.id} with status ${judgeResult.status}`);
                return judgeResult;
            }
            catch (error) {
                console.error(`Error processing submission ${submission.id}:`, error);
                const errorResult = {
                    submissionId: submission.id,
                    status: "INTERNAL_ERROR",
                    testCasesPassed: 0,
                    totalTestCases: 0,
                    errorMessage: error instanceof Error ? error.message : "Unknown error",
                    testCaseResults: [],
                };
                yield this.updateSubmissionResult(errorResult);
                return errorResult;
            }
        });
    }
    updateSubmissionResult(result) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.prisma.submission.update({
                    where: { id: result.submissionId },
                    data: {
                        status: result.status,
                        testCasesPassed: result.testCasesPassed,
                        totalTestCases: result.totalTestCases,
                        runtime: result.runtime,
                        memory: result.memory,
                        errorMessage: result.errorMessage,
                    },
                });
            }
            catch (error) {
                console.error("Failed to update submission result:", error);
            }
        });
    }
    getSubmissionResult(submissionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const submission = yield this.prisma.submission.findUnique({
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
                    runtime: submission.runtime,
                    memory: submission.memory,
                    errorMessage: submission.errorMessage,
                    testCaseResults: [], // You might want to store and retrieve detailed results
                };
            }
            catch (error) {
                console.error("Error fetching submission result:", error);
                return null;
            }
        });
    }
}
exports.JudgingService = JudgingService;
