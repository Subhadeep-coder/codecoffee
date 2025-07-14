"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Bookmark, BookmarkCheck, ThumbsUp, ThumbsDown } from "lucide-react";
import { type Problem, useProblemsStore } from "@/stores/problems-store";
import { useAuthStore } from "@/stores/auth-store";

interface ProblemDescriptionProps {
  problem: Problem;
}

export function ProblemDescription({ problem }: ProblemDescriptionProps) {
  const { toggleBookmark } = useProblemsStore();
  const { isAuthenticated } = useAuthStore();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "HARD":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  // Format test cases as markdown
  const getTestCasesMarkdown = () => {
    if (!problem.testCases || problem.testCases.length === 0) return "";

    let markdown = "\n## Examples\n\n";
    problem.testCases.forEach((testCase, index) => {
      markdown += `**Example ${index + 1}:**\n\n`;
      markdown += `**Input:** \`${testCase.input}\`\n\n`;
      markdown += `**Output:** \`${testCase.expectedOutput}\`\n\n`;
      if (testCase.explanation) {
        markdown += `**Explanation:** ${testCase.explanation}\n\n`;
      }
    });

    return markdown;
  };

  const getConstraintsMarkdown = () => {
    if (!problem.constraints) return "";
    return `\n## Constraints\n\n${problem.constraints}\n\n`;
  };

  const getFullMarkdown = () => {
    let markdown = problem.description || "";
    markdown += getTestCasesMarkdown();
    markdown += getConstraintsMarkdown();
    return markdown;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">
            {problem.title}
          </h1>
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleBookmark(problem.id)}
            >
              {problem.isBookmarked ? (
                <BookmarkCheck className="h-4 w-4 text-blue-500" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4 mb-4">
          <Badge className={getDifficultyColor(problem.difficulty)}>
            {problem.difficulty}
          </Badge>
          <div className="flex gap-2">
            {problem.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <span>Acceptance: {problem.acceptanceRate}%</span>
          <span>Submissions: {problem.totalSubmissions?.toLocaleString()}</span>
          <span>Discussions: {problem._count?.discussions}</span>
          <span>Frequency: {problem.frequency}</span>
        </div>
      </div>

      <div className="prose prose-sm max-w-none dark:prose-invert">
        <ReactMarkdown
          components={{
            code: ({ node, inline, className, children, ...props }: any) => {
              if (inline) {
                return (
                  <code
                    className="bg-muted px-1 py-0.5 rounded text-sm font-mono"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }
              return (
                <div className="bg-muted p-4 rounded-lg overflow-x-auto whitespace-pre">
                  <code className="text-sm font-mono" {...props}>
                    {children}
                  </code>
                </div>
              );
            },
            h2: ({ children, ...props }) => (
              <h2
                className="text-lg font-semibold text-foreground mt-6 mb-3"
                {...props}
              >
                {children}
              </h2>
            ),
            h3: ({ children, ...props }) => (
              <h3
                className="text-base font-semibold text-foreground mt-4 mb-2"
                {...props}
              >
                {children}
              </h3>
            ),
            p: ({ children, ...props }) => (
              <div className="text-foreground mb-4 leading-relaxed" {...props}>
                {children}
              </div>
            ),
            ul: ({ children, ...props }) => (
              <ul
                className="list-disc list-inside text-foreground mb-4 space-y-1"
                {...props}
              >
                {children}
              </ul>
            ),
            li: ({ children, ...props }) => (
              <li className="text-foreground" {...props}>
                {children}
              </li>
            ),
            strong: ({ children, ...props }) => (
              <strong className="font-semibold text-foreground" {...props}>
                {children}
              </strong>
            ),
          }}
        >
          {getFullMarkdown()}
        </ReactMarkdown>
      </div>

      {((problem.hints && problem.hints.length > 0) ||
        (problem.companies && problem.companies.length > 0)) && (
        <div className="mt-6">
          <Accordion type="single" collapsible className="w-full">
            {problem.hints &&
              problem.hints.length > 0 &&
              problem.hints.map((hint, index) => (
                <AccordionItem key={index} value={`hint-${index}`}>
                  <AccordionTrigger>
                    <span className="text-sm font-medium">
                      Hint {index + 1}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-foreground">{hint}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}

            {problem.companies && problem.companies.length > 0 && (
              <AccordionItem value="companies">
                <AccordionTrigger>
                  <span className="text-sm font-medium">
                    Companies ({problem.companies.length})
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2">
                    {problem.companies.map((company) => (
                      <Badge
                        key={company}
                        variant="outline"
                        className="text-xs"
                      >
                        {company}
                      </Badge>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      )}

      {isAuthenticated && (
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Was this helpful?
            </span>
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
  );
}
