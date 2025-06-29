"use client"

import { useState, useEffect } from "react"
import { ProblemsTable } from "@/components/problems/problems-table"
import { ProblemsFilter } from "@/components/problems/problems-filter"
import { useProblemsStore } from "@/stores/problems-store"
import { Navbar } from "@/components/layout/navbar"

// Mock data - replace with API call
const mockProblems = [
  {
    id: "1",
    title: "Two Sum",
    difficulty: "Easy" as const,
    category: "Array",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
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
    isSolved: true,
  },
  {
    id: "2",
    title: "Add Two Numbers",
    difficulty: "Medium" as const,
    category: "Linked List",
    description: "You are given two non-empty linked lists representing two non-negative integers.",
    examples: [
      {
        input: "l1 = [2,4,3], l2 = [5,6,4]",
        output: "[7,0,8]",
        explanation: "342 + 465 = 807.",
      },
    ],
    constraints: ["The number of nodes in each linked list is in the range [1, 100]"],
    acceptance: 38.1,
    submissions: 987654,
    isBookmarked: true,
    isSolved: false,
  },
  {
    id: "3",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium" as const,
    category: "String",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc", with the length of 3.',
      },
    ],
    constraints: ["0 ≤ s.length ≤ 5 * 10⁴"],
    acceptance: 33.8,
    submissions: 876543,
    isBookmarked: false,
    isSolved: false,
  },
]

export default function ProblemsPage() {
  const { problems, setProblems } = useProblemsStore()
  const [filteredProblems, setFilteredProblems] = useState(mockProblems)

  useEffect(() => {
    setProblems(mockProblems)
    setFilteredProblems(mockProblems)
  }, [setProblems])

  const handleFilter = (filters: {
    difficulty: string[]
    category: string[]
    status: string
    search: string
  }) => {
    let filtered = mockProblems

    if (filters.difficulty.length > 0) {
      filtered = filtered.filter((p) => filters.difficulty.includes(p.difficulty))
    }

    if (filters.category.length > 0) {
      filtered = filtered.filter((p) => filters.category.includes(p.category))
    }

    if (filters.status === "solved") {
      filtered = filtered.filter((p) => p.isSolved)
    } else if (filters.status === "unsolved") {
      filtered = filtered.filter((p) => !p.isSolved)
    }

    if (filters.search) {
      filtered = filtered.filter((p) => p.title.toLowerCase().includes(filters.search.toLowerCase()))
    }

    setFilteredProblems(filtered)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Problems</h1>
          <p className="text-muted-foreground">Solve coding problems to improve your algorithmic thinking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <ProblemsFilter onFilter={handleFilter} />
          </div>
          <div className="lg:col-span-3">
            <ProblemsTable problems={filteredProblems} />
          </div>
        </div>
      </div>
    </div>
  )
}
