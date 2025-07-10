export interface Problem {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  tags: string[];
  constraints: string;
  hints: string[];
  totalSubmissions: number;
  acceptedSubmissions: number;
  acceptanceRate: number;
  createdBy: string;
  isPublished: boolean;
  isPremium: boolean;
  companies: string[];
  frequency: number;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    username: string;
    firstName: string;
    lastName: string | null;
  };
  _count: {
    submissions: number;
    discussions: number;
    bookmarks: number;
  };
  isBookmarked?: boolean;
  isSolved?: boolean;
}

export interface TestCaseDto {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  explanation?: string;
}

export interface ProblemTemplateDto {
  language: string;
  template: string;
  templateIdentifier: string;
}

export interface CreateProblemsDto {
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  constraints: string;
  hints: string[];
  companies: string[];
  testCases: TestCaseDto[];
  isPremium?: boolean;
  problemTemplates?: ProblemTemplateDto[];
}

export const PROGRAMMING_LANGUAGES = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "C",
  "C#",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  "TypeScript",
];
