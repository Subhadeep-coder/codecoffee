"use client"

import ReactMarkdown from "react-markdown"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bookmark, BookmarkCheck, ThumbsUp, ThumbsDown } from "lucide-react"
import { useProblemsStore } from "@/stores/problems-store"
import { useAuthStore } from "@/stores/auth-store"
import React from "react"

interface Problem {
    id: string
    title: string
    difficulty: "Easy" | "Medium" | "Hard"
    category: string
    description: string
    acceptance: number
    submissions: number
    isBookmarked: boolean
    isSolved: boolean
}

interface ProblemDescriptionProps {
    problem: Problem
}

export function ProblemDescription({ problem }: ProblemDescriptionProps) {
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
        <div className="p-6">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-foreground">{problem.title}</h1>
                    {isAuthenticated && (
                        <Button variant="ghost" size="sm" onClick={() => toggleBookmark(problem.id)}>
                            {problem.isBookmarked ? (
                                <BookmarkCheck className="h-4 w-4 text-blue-500" />
                            ) : (
                                <Bookmark className="h-4 w-4" />
                            )}
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-4 mb-4">
                    <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                    <span className="text-sm text-muted-foreground">{problem.category}</span>
                </div>

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span>Acceptance: {problem.acceptance}%</span>
                    <span>Submissions: {problem.submissions.toLocaleString()}</span>
                </div>
            </div>

            <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown
                    components={{
                        code: ({ node, inline, className, children, ...props }: any) => {
                            if (inline) {
                                return (
                                    <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono" {...props}>
                                        {children}
                                    </code>
                                )
                            }
                            return (
                                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                                    <code className="text-sm font-mono" {...props}>
                                        {children}
                                    </code>
                                </pre>
                            )
                        },
                        h2: ({ children }: { children: React.ReactNode }) => <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">{children}</h2>,
                        h3: ({ children }: { children: React.ReactNode }) => <h3 className="text-base font-semibold text-foreground mt-4 mb-2">{children}</h3>,
                        p: ({ children }: { children: React.ReactNode }) => <p className="text-foreground mb-4 leading-relaxed">{children}</p>,
                        ul: ({ children }: { children: React.ReactNode }) => <ul className="list-disc list-inside text-foreground mb-4 space-y-1">{children}</ul>,
                        li: ({ children }: { children: React.ReactNode }) => <li className="text-foreground">{children}</li>,
                    }}
                >
                    {problem.description}
                </ReactMarkdown>
            </div>

            {isAuthenticated && (
                <div className="mt-8 pt-6 border-t border-border">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">Was this helpful?</span>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                Yes
                            </Button>
                            <Button variant="ghost" size="sm">
                                <ThumbsDown className="h-4 w-4 mr-1" />
                                No
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
