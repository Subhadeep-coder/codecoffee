import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateContestDto } from "@/types/contest";
import { Search, X } from "lucide-react";
import { ProblemInContestSearch } from "@/types/problem";
import { useDebounceSearchProblems } from "@/hooks/useSearchProblems";

interface ProblemsTabProps {
  contest: CreateContestDto;
  setContest: React.Dispatch<React.SetStateAction<CreateContestDto>>;
  problems: ProblemInContestSearch[];
  setProblems: React.Dispatch<React.SetStateAction<ProblemInContestSearch[]>>;
}

export const ProblemsTab = ({
  contest,
  setContest,
  problems,
  setProblems,
}: ProblemsTabProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const {
    problems: searchResults,
    loading,
    error,
  } = useDebounceSearchProblems(searchQuery);

  const displayProblems = searchQuery.trim() ? searchResults : [];

  const handleProblemSelect = (problem: ProblemInContestSearch) => {
    if (!problems.find((p) => p.id === problem.id)) {
      setProblems([...problems, problem]);
      setContest((prev) => ({
        ...prev,
        problemIds: [...prev.problemIds, problem.id],
      }));
    }
  };

  const handleProblemRemove = (problemId: string) => {
    setProblems(problems.filter((p) => p.id !== problemId));
    setContest((prev) => ({
      ...prev,
      problemIds: prev.problemIds.filter((id) => id !== problemId),
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="border-gray-200">
      <CardContent className="space-y-6 p-6">
        <div>
          <Label className="text-sm font-medium text-black">
            Search Problems
          </Label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by title or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-300 focus:border-black focus:ring-black"
            />
          </div>
        </div>

        {/* Selected Problems */}
        {problems.length > 0 && (
          <div>
            <Label className="text-sm font-medium text-black">
              Selected Problems ({problems.length})
            </Label>
            <div className="mt-2 space-y-2">
              {problems.map((problem) => (
                <div
                  key={problem.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-black">
                      {problem.title}
                    </span>
                    <Badge className={getDifficultyColor(problem.difficulty)}>
                      {problem.difficulty}
                    </Badge>
                    <div className="flex space-x-1">
                      {problem.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleProblemRemove(problem.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Problems */}
        <div>
          <Label className="text-sm font-medium text-black">
            Available Problems
          </Label>
          <div className="mt-2 max-h-64 overflow-y-auto space-y-2">
            {displayProblems.map((problem) => (
              <div
                key={problem.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  problems.find((p) => p.id === problem.id)
                    ? "border-gray-300 bg-gray-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => handleProblemSelect(problem)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-black">
                      {problem.title}
                    </span>
                    <Badge className={getDifficultyColor(problem.difficulty)}>
                      {problem.difficulty}
                    </Badge>
                  </div>
                  {problems.find((p) => p.id === problem.id) && (
                    <span className="text-sm text-gray-500">Selected</span>
                  )}
                </div>
                <div className="flex space-x-1 mt-2">
                  {problem.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
