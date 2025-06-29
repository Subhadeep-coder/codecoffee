import { create } from "zustand"

interface Problem {
    id: string
    title: string
    difficulty: "Easy" | "Medium" | "Hard"
    category: string
    description: string
    examples: Array<{
        input: string
        output: string
        explanation?: string
    }>
    constraints: string[]
    acceptance: number
    submissions: number
    isBookmarked: boolean
    isSolved: boolean
}

interface ProblemsState {
    problems: Problem[]
    currentProblem: Problem | null
    bookmarkedProblems: string[]
    solvedProblems: string[]
    setProblems: (problems: Problem[]) => void
    setCurrentProblem: (problem: Problem) => void
    toggleBookmark: (problemId: string) => void
    markAsSolved: (problemId: string) => void
}

export const useProblemsStore = create<ProblemsState>((set, get) => ({
    problems: [],
    currentProblem: null,
    bookmarkedProblems: [],
    solvedProblems: [],

    setProblems: (problems) => set({ problems }),

    setCurrentProblem: (problem) => set({ currentProblem: problem }),

    toggleBookmark: (problemId) => {
        const { bookmarkedProblems } = get()
        const isBookmarked = bookmarkedProblems.includes(problemId)

        set({
            bookmarkedProblems: isBookmarked
                ? bookmarkedProblems.filter((id) => id !== problemId)
                : [...bookmarkedProblems, problemId],
        })
    },

    markAsSolved: (problemId) => {
        const { solvedProblems } = get()
        if (!solvedProblems.includes(problemId)) {
            set({ solvedProblems: [...solvedProblems, problemId] })
        }
    },
}))
