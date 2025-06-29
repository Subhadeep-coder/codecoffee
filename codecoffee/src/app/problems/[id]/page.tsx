"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { ProblemDescription } from "@/components/problems/problem-description"
import { CodeEditor } from "@/components/problems/code-editor"
import { ProblemComments } from "@/components/problems/problem-comments"
import { useAuthStore } from "@/stores/auth-store"
import { useProblemsStore } from "@/stores/problems-store"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ProblemPage() {
  const params = useParams()
  const { isAuthenticated } = useAuthStore()
  const { currentProblem, setCurrentProblem } = useProblemsStore()
  const [activeTab, setActiveTab] = useState<"description" | "comments">("description")

  // Mock problem data - replace with API call
  const mockProblem = {
    id: params.id as string,
    title: "Two Sum",
    difficulty: "Easy" as const,
    category: "Array",
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to target*.

You may assume that each input would have ***exactly* one solution**, and you may not use the *same* element twice.

You can return the answer in any order.

## Example 1:

\`\`\`
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

## Example 2:

\`\`\`
Input: nums = [3,2,4], target = 6
Output: [1,2]
\`\`\`

## Example 3:

\`\`\`
Input: nums = [3,3], target = 6
Output: [0,1]
\`\`\`

## Constraints:

- \`2 <= nums.length <= 10^4\`
- \`-10^9 <= nums[i] <= 10^9\`
- \`-10^9 <= target <= 10^9\`
- **Only one valid answer exists.**

## Follow-up:
Can you come up with an algorithm that is less than O(n²) time complexity?`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
    ],
    constraints: ["2 ≤ nums.length ≤ 10⁴", "-10⁹ ≤ nums[i] ≤ 10⁹", "-10⁹ ≤ target ≤ 10⁹"],
    acceptance: 49.2,
    submissions: 1234567,
    isBookmarked: false,
    isSolved: false,
  }

  useEffect(() => {
    setCurrentProblem(mockProblem)
  }, [params.id, setCurrentProblem])

  if (!currentProblem) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Panel - Problem Description */}
        <div className="w-1/2 border-r border-border flex flex-col">
          <div className="border-b border-border">
            <div className="flex">
              <button
                className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === "description"
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === "comments"
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                onClick={() => setActiveTab("comments")}
              >
                Comments
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {activeTab === "description" ? (
              <ProblemDescription problem={currentProblem} />
            ) : (
              <ProblemComments problemId={currentProblem.id} />
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col">
          {isAuthenticated ? (
            <CodeEditor problemId={currentProblem.id} />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-muted/30">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">Sign in to start coding</h3>
                <p className="text-muted-foreground mb-4">You need to be logged in to access the code editor</p>
                <Button asChild>
                  <Link href="/auth">Sign In</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
