import { create } from "zustand";

interface Creator {
  id: string;
  username: string;
  firstName: string;
  lastName: string | null;
}

interface TestCase {
  input: string;
  expectedOutput: string;
  explanation: string;
}

interface ProblemTemplate {
  id: string;
  problemId: string;
  language: string;
  template: string;
  mainClass: string;
  methodName: string;
  returnType: string;
  paramTypes: string[];
}

interface InputFormat {
  id: string;
  problemId: string;
  formatType: string;
  parseMethod: string;
}

interface Problem {
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
  creator: Creator;
  testCases: TestCase[];
  problemTemplate: ProblemTemplate[];
  inputFormat: InputFormat[];
  _count: {
    submissions: number;
    discussions: number;
    bookmarks: number;
  };
  isBookmarked?: boolean;
  isSolved?: boolean;
}

interface ProblemsState {
  problems: Problem[];
  currentProblem: Problem | null;
  bookmarkedProblems: string[];
  solvedProblems: string[];
  loading: boolean;
  error: string | null;
  setProblems: (problems: Problem[]) => void;
  setCurrentProblem: (problem: Problem | null) => void;
  toggleBookmark: (problemId: string) => void;
  markAsSolved: (problemId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  getProblemById: (id: string) => Problem | undefined;
  getBookmarkedProblems: () => Problem[];
  getSolvedProblems: () => Problem[];
  isProblemBookmarked: (problemId: string) => boolean;
  isProblemSolved: (problemId: string) => boolean;
}

export const useProblemsStore = create<ProblemsState>((set, get) => ({
  problems: [],
  currentProblem: null,
  bookmarkedProblems: [],
  solvedProblems: [],
  loading: false,
  error: null,

  setProblems: (problems) => {
    const { bookmarkedProblems, solvedProblems } = get();

    // Add client-side computed properties
    const enrichedProblems = problems.map((problem) => ({
      ...problem,
      isBookmarked: bookmarkedProblems.includes(problem.id),
      isSolved: solvedProblems.includes(problem.id),
    }));

    set({ problems: enrichedProblems });
  },

  setCurrentProblem: (problem) => {
    if (problem) {
      const { bookmarkedProblems, solvedProblems } = get();
      const enrichedProblem = {
        ...problem,
        isBookmarked: bookmarkedProblems.includes(problem.id),
        isSolved: solvedProblems.includes(problem.id),
      };
      set({ currentProblem: enrichedProblem });
    } else {
      set({ currentProblem: null });
    }
  },

  toggleBookmark: (problemId) => {
    const { bookmarkedProblems, problems, currentProblem } = get();
    const isBookmarked = bookmarkedProblems.includes(problemId);

    const newBookmarkedProblems = isBookmarked
      ? bookmarkedProblems.filter((id) => id !== problemId)
      : [...bookmarkedProblems, problemId];

    // Update problems list
    const updatedProblems = problems.map((problem) =>
      problem.id === problemId
        ? { ...problem, isBookmarked: !isBookmarked }
        : problem,
    );

    // Update current problem if it matches
    const updatedCurrentProblem =
      currentProblem?.id === problemId
        ? { ...currentProblem, isBookmarked: !isBookmarked }
        : currentProblem;

    set({
      bookmarkedProblems: newBookmarkedProblems,
      problems: updatedProblems,
      currentProblem: updatedCurrentProblem,
    });
  },

  markAsSolved: (problemId) => {
    const { solvedProblems, problems, currentProblem } = get();

    if (!solvedProblems.includes(problemId)) {
      const newSolvedProblems = [...solvedProblems, problemId];

      // Update problems list
      const updatedProblems = problems.map((problem) =>
        problem.id === problemId ? { ...problem, isSolved: true } : problem,
      );

      // Update current problem if it matches
      const updatedCurrentProblem =
        currentProblem?.id === problemId
          ? { ...currentProblem, isSolved: true }
          : currentProblem;

      set({
        solvedProblems: newSolvedProblems,
        problems: updatedProblems,
        currentProblem: updatedCurrentProblem,
      });
    }
  },

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  // Helper methods
  getProblemById: (id) => {
    const { problems } = get();
    return problems.find((problem) => problem.id === id);
  },

  getBookmarkedProblems: () => {
    const { problems, bookmarkedProblems } = get();
    return problems.filter((problem) =>
      bookmarkedProblems.includes(problem.id),
    );
  },

  getSolvedProblems: () => {
    const { problems, solvedProblems } = get();
    return problems.filter((problem) => solvedProblems.includes(problem.id));
  },

  isProblemBookmarked: (problemId) => {
    const { bookmarkedProblems } = get();
    return bookmarkedProblems.includes(problemId);
  },

  isProblemSolved: (problemId) => {
    const { solvedProblems } = get();
    return solvedProblems.includes(problemId);
  },
}));

export type { Problem, Creator, TestCase, ProblemTemplate, InputFormat };
