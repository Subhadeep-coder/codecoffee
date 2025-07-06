export interface SubmissionRequest {
  id: string;
  userId: string;
  problemId: string;
  code: string;
  language: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  timeLimit: number;
  memoryLimit: number;
  isHidden: boolean;
  weight: number;
}

export interface ExecutionResult {
  status:
    | "ACCEPTED"
    | "WRONG_ANSWER"
    | "TIME_LIMIT_EXCEEDED"
    | "MEMORY_LIMIT_EXCEEDED"
    | "RUNTIME_ERROR"
    | "COMPILATION_ERROR"
    | "INTERNAL_ERROR";
  output?: string;
  runtime?: number; // in milliseconds
  memory?: number; // in KB
  errorMessage?: string;
  compilationOutput?: string;
}

export interface JudgeResult {
  submissionId: string;
  status: string;
  testCasesPassed: number;
  totalTestCases: number;
  runtime?: number;
  memory?: number;
  errorMessage?: string;
  testCaseResults: TestCaseResult[];
}

export interface TestCaseResult {
  testCaseId: string;
  status: string;
  runtime?: number;
  memory?: number;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  errorMessage?: string;
}

export interface ProblemTemplate {
  language: string;
  template: string;
  placeholders: {
    functionName: string;
    parameters: string;
    returnType: string;
    [key: string]: string;
  };
}
