"use client"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bookmark, BookmarkCheck, CheckCircle } from "lucide-react"
import { useProblemsStore } from "@/stores/problems-store"
import { useAuthStore } from "@/stores/auth-store"

interface Problem {
    id: string
    title: string
    difficulty: "Easy" | "Medium" | "Hard"
    category: string
    acceptance: number
    submissions: number
    isBookmarked: boolean
    isSolved: boolean
}

interface ProblemsTableProps {
    problems: Problem[]
}

export function ProblemsTable({ problems }: ProblemsTableProps) {
    const { toggleBookmark } = useProblemsStore()
    const { isAuthenticated } = useAuthStore()

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "Easy":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            case "Medium":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
            case "Hard":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
        }
    }

    return (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Difficulty
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Acceptance
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {problems.map((problem) => (
                            <tr key={problem.id} className="hover:bg-muted/30">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {problem.isSolved && <CheckCircle className="h-5 w-5 text-green-500" />}
                                </td>
                                <td className="px-6 py-4">
                                    <Link
                                        href={`/problems/${problem.id}`}
                                        className="text-foreground hover:text-foreground/80 font-medium"
                                    >
                                        {problem.title}
                                    </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{problem.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{problem.acceptance}%</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {isAuthenticated && (
                                        <Button variant="ghost" size="sm" onClick={() => toggleBookmark(problem.id)}>
                                            {problem.isBookmarked ? (
                                                <BookmarkCheck className="h-4 w-4 text-blue-500" />
                                            ) : (
                                                <Bookmark className="h-4 w-4" />
                                            )}
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
