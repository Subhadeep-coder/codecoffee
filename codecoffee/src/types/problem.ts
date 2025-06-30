export interface Problem {
    id: string
    title: string
    slug: string
    description: string
    difficulty: "EASY" | "MEDIUM" | "HARD"
    tags: string[]
    constraints: string
    hints: string[]
    totalSubmissions: number
    acceptedSubmissions: number
    acceptanceRate: number
    createdBy: string
    isPublished: boolean
    isPremium: boolean
    companies: string[]
    frequency: number
    createdAt: string
    updatedAt: string
    creator: {
        id: string
        username: string
        firstName: string
        lastName: string | null
    }
    _count: {
        submissions: number
        discussions: number
        bookmarks: number
    }
    isBookmarked?: boolean
    isSolved?: boolean
}