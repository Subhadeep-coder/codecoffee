"use client";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Bookmark, BookmarkCheck, CheckCircle, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Problem } from "@/types/problem";
import { api } from "@/lib/axios";

export default function ProblemsPage() {
  const router = useRouter();
  const [problems, setProblems] = useState<Problem[]>([]);
  const isAuthenticated = true;

  useEffect(() => {
    const fetchProblems = async () => {
      const response = await api.get("/problems/get/me");
      const data = response.data;
      setProblems(data);
    };

    fetchProblems();
  }, []);

  const toggleBookmark = (problemId: string) => {
    setProblems((prev) =>
      prev.map((problem) =>
        problem.id === problemId
          ? { ...problem, isBookmarked: !problem.isBookmarked }
          : problem,
      ),
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const handleCreateProblem = () => {
    console.log("Create new problem");
    router.push("/problems/create");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            My Problems
          </h1>
          <Button
            onClick={handleCreateProblem}
            className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Problem
          </Button>
        </div>

        {/* Problems Table */}
        <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Acceptance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {problems.map((problem) => (
                  <tr
                    key={problem.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {problem.isSolved && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/problems/${problem.id}`}
                        className="text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 font-medium transition-colors"
                      >
                        {problem.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getDifficultyColor(problem.difficulty)}>
                        {problem.difficulty}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                      {problem.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                      {problem.acceptance}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isAuthenticated && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBookmark(problem.id)}
                          className="hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          {problem.isBookmarked ? (
                            <BookmarkCheck className="h-4 w-4 text-blue-500" />
                          ) : (
                            <Bookmark className="h-4 w-4 text-gray-600 dark:text-gray-400" />
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
      </div>
    </div>
  );
}
