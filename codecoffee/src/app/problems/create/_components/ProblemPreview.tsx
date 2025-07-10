import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Code,
  TestTube,
  Lightbulb,
  Building,
  Crown,
  Star,
  Clock,
  Target,
} from "lucide-react";
import { CreateProblemsDto } from "@/types/problem";

interface ProblemPreviewProps {
  problem: CreateProblemsDto;
}

export function ProblemPreview({ problem }: ProblemPreviewProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const renderMarkdown = (text: string) => {
    if (!text) return null;

    // Simple markdown rendering - you might want to use a proper markdown library
    return text.split("\n").map((line, index) => {
      if (line.startsWith("# ")) {
        return (
          <h1 key={index} className="text-2xl font-bold mb-2">
            {line.substring(2)}
          </h1>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={index} className="text-xl font-semibold mb-2">
            {line.substring(3)}
          </h2>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3 key={index} className="text-lg font-medium mb-2">
            {line.substring(4)}
          </h3>
        );
      }
      if (line.startsWith("- ")) {
        return (
          <li key={index} className="ml-4 list-disc">
            {line.substring(2)}
          </li>
        );
      }
      if (line.startsWith("`") && line.endsWith("`")) {
        return (
          <code
            key={index}
            className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono"
          >
            {line.slice(1, -1)}
          </code>
        );
      }
      if (line.trim() === "") {
        return <br key={index} />;
      }
      return (
        <p key={index} className="mb-2">
          {line}
        </p>
      );
    });
  };

  const visibleTestCases = problem.testCases.filter((tc) => !tc.isHidden);
  const hiddenTestCases = problem.testCases.filter((tc) => tc.isHidden);

  return (
    <div className="space-y-6">
      {/* Preview Header */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-black dark:text-white">
            <Eye className="h-5 w-5" />
            Problem Preview
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Problem Header */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Title and Difficulty */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-black dark:text-white mb-2">
                  {problem.title || "Untitled Problem"}
                </h1>
                <div className="flex items-center gap-2">
                  <Badge className={getDifficultyColor(problem.difficulty)}>
                    <Target className="h-3 w-3 mr-1" />
                    {problem.difficulty}
                  </Badge>
                  {problem.isPremium && (
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            {problem.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {problem.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Companies */}
            {problem.companies.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Building className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Asked by:
                </span>
                {problem.companies.map((company, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {company}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Problem Description */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-black dark:text-white">
            Problem Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none text-black dark:text-white">
            {problem.description ? (
              renderMarkdown(problem.description)
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">
                No description provided yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Constraints */}
      {problem.constraints && (
        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-black dark:text-white">
              Constraints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-black dark:text-white">
                {problem.constraints}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Cases */}
      {problem.testCases.length > 0 && (
        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-black dark:text-white">
              <TestTube className="h-5 w-5" />
              Examples
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {visibleTestCases.map((testCase, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="font-semibold text-black dark:text-white mb-2">
                  Example {index + 1}:
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Input:
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded font-mono text-sm">
                      <pre className="whitespace-pre-wrap text-black dark:text-white">
                        {testCase.input || "No input provided"}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Output:
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded font-mono text-sm">
                      <pre className="whitespace-pre-wrap text-black dark:text-white">
                        {testCase.expectedOutput || "No output provided"}
                      </pre>
                    </div>
                  </div>

                  {testCase.explanation && (
                    <div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Explanation:
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {testCase.explanation}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {hiddenTestCases.length > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {hiddenTestCases.length} hidden test case(s) will be used
                    for evaluation
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Code Templates */}
      {problem.problemTemplates && problem.problemTemplates.length > 0 && (
        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-black dark:text-white">
              <Code className="h-5 w-5" />
              Code Templates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {problem.problemTemplates.map((template, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline">{template.language}</Badge>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <pre className="text-sm font-mono overflow-x-auto text-black dark:text-white">
                    {template.template || "// No template code provided"}
                  </pre>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Hints */}
      {problem.hints.length > 0 && (
        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-black dark:text-white">
              <Lightbulb className="h-5 w-5" />
              Hints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {problem.hints.map((hint, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    {hint}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Footer */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardContent className="p-4">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            This is how your problem will appear to users. Make sure all details
            are correct before creating.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
