"use client"

import { useEffect, useState } from "react"
import { ProblemCard } from "@/components/problem-card"
import { FilterBar } from "@/components/filter-bar"
import { Skeleton } from "@/components/ui/skeleton"

interface Problem {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  tags: string[]
  solvedCount: number
}

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const [allTags, setAllTags] = useState<string[]>([])

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true)
        // In a real app, this would be an API call
        // const response = await axios.get("/api/problems")
        // const data = response.data

        // Mock data for demonstration
        const data: Problem[] = [
          {
            id: "1",
            title: "Two Sum",
            difficulty: "Easy",
            tags: ["Array", "Hash Table"],
            solvedCount: 5432109,
          },
          {
            id: "2",
            title: "Add Two Numbers",
            difficulty: "Medium",
            tags: ["Linked List", "Math", "Recursion"],
            solvedCount: 2345678,
          },
          {
            id: "3",
            title: "Longest Substring Without Repeating Characters",
            difficulty: "Medium",
            tags: ["Hash Table", "String", "Sliding Window"],
            solvedCount: 3456789,
          },
          {
            id: "4",
            title: "Median of Two Sorted Arrays",
            difficulty: "Hard",
            tags: ["Array", "Binary Search", "Divide and Conquer"],
            solvedCount: 1234567,
          },
          {
            id: "5",
            title: "Longest Palindromic Substring",
            difficulty: "Medium",
            tags: ["String", "Dynamic Programming"],
            solvedCount: 2987654,
          },
          {
            id: "6",
            title: "ZigZag Conversion",
            difficulty: "Medium",
            tags: ["String"],
            solvedCount: 1876543,
          },
          {
            id: "7",
            title: "Reverse Integer",
            difficulty: "Medium",
            tags: ["Math"],
            solvedCount: 3765432,
          },
          {
            id: "8",
            title: "String to Integer (atoi)",
            difficulty: "Medium",
            tags: ["String", "Math"],
            solvedCount: 1654321,
          },
          {
            id: "9",
            title: "Palindrome Number",
            difficulty: "Easy",
            tags: ["Math"],
            solvedCount: 4321098,
          },
          {
            id: "10",
            title: "Regular Expression Matching",
            difficulty: "Hard",
            tags: ["String", "Dynamic Programming", "Recursion"],
            solvedCount: 987654,
          },
          {
            id: "11",
            title: "Container With Most Water",
            difficulty: "Medium",
            tags: ["Array", "Two Pointers", "Greedy"],
            solvedCount: 2765432,
          },
          {
            id: "12",
            title: "Integer to Roman",
            difficulty: "Medium",
            tags: ["Hash Table", "Math", "String"],
            solvedCount: 1987654,
          },
        ]

        setProblems(data)
        setFilteredProblems(data)

        // Extract all unique tags
        const tags = Array.from(new Set(data.flatMap((problem) => problem.tags))).sort()
        setAllTags(tags)
      } catch (error) {
        console.error("Error fetching problems:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProblems()
  }, [])

  const handleFilterChange = (filters: {
    search: string
    difficulty: string[]
    tags: string[]
  }) => {
    let filtered = [...problems]

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter((problem) => problem.title.toLowerCase().includes(searchLower))
    }

    if (filters.difficulty.length > 0) {
      filtered = filtered.filter((problem) => filters.difficulty.includes(problem.difficulty))
    }

    if (filters.tags.length > 0) {
      filtered = filtered.filter((problem) => filters.tags.some((tag) => problem.tags.includes(tag)))
    }

    setFilteredProblems(filtered)
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Problems</h1>
          <p className="text-muted-foreground">Browse through our collection of coding challenges and start solving.</p>
        </div>

        <FilterBar onFilterChange={handleFilterChange} availableTags={allTags} />

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="rounded-lg border p-4">
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <>
            {filteredProblems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No problems found matching your filters.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProblems.map((problem) => (
                  <ProblemCard
                    key={problem.id}
                    id={problem.id}
                    title={problem.title}
                    difficulty={problem.difficulty}
                    tags={problem.tags}
                    solvedCount={problem.solvedCount}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
