"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

interface SubmissionResultsProps {
  submissionResult: any;
}

export function SubmissionResults({
  submissionResult,
}: SubmissionResultsProps) {
  if (!submissionResult) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <Clock className="h-8 w-8 mx-auto mb-2" />
        <p>No submission results yet</p>
        <p className="text-sm">Run your code to see results here</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "FAILED":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "FAILED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          {getStatusIcon(submissionResult.status)}
          <h2 className="text-xl font-semibold text-foreground">
            Submission Results
          </h2>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <Badge className={getStatusColor(submissionResult.status)}>
            {submissionResult.status}
          </Badge>
          <div className="text-sm text-muted-foreground">
            {submissionResult.testCasesPassed}/{submissionResult.totalTestCases}{" "}
            test cases passed
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-muted/30 p-3 rounded-lg">
            <div className="text-sm text-muted-foreground">Runtime</div>
            <div className="text-lg font-semibold text-foreground">
              {submissionResult.runtime || "N/A"} ms
            </div>
          </div>
          <div className="bg-muted/30 p-3 rounded-lg">
            <div className="text-sm text-muted-foreground">Memory</div>
            <div className="text-lg font-semibold text-foreground">
              {submissionResult.memory || "N/A"} MB
            </div>
          </div>
        </div>
      </div>

      {submissionResult.error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-red-700 dark:text-red-300">
              Error
            </span>
          </div>
          <pre className="text-sm text-red-600 dark:text-red-400 whitespace-pre-wrap">
            {submissionResult.error}
          </pre>
        </div>
      )}

      {submissionResult.testCases && submissionResult.testCases.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Test Cases Results
          </h3>
          <div className="space-y-4">
            {submissionResult.testCases.map((testCase: any, index: number) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  testCase.passed
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  {testCase.passed ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm font-medium">
                    Test Case {index + 1}
                  </span>
                  <Badge
                    variant={testCase.passed ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {testCase.passed ? "Passed" : "Failed"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">
                      Input:
                    </span>
                    <pre className="text-xs text-foreground font-mono bg-muted p-2 rounded mt-1">
                      {testCase.input}
                    </pre>
                  </div>

                  {!testCase.passed && (
                    <>
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">
                          Expected:
                        </span>
                        <pre className="text-xs text-foreground font-mono bg-muted p-2 rounded mt-1">
                          {testCase.expected}
                        </pre>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">
                          Got:
                        </span>
                        <pre className="text-xs text-red-600 dark:text-red-400 font-mono bg-muted p-2 rounded mt-1">
                          {testCase.actual}
                        </pre>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
