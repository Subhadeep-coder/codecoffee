"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ProblemDescription } from "@/components/problems/problem-description";
import { CodeEditor } from "@/components/problems/code-editor";
import { ProblemComments } from "@/components/problems/problem-comments";
import { useAuthStore } from "@/stores/auth-store";
import { useProblemsStore, type Problem } from "@/stores/problems-store";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SubmissionHistory } from "@/components/problems/SubmissionResults";

export default function ProblemPage() {
  const params = useParams();
  const { isAuthenticated } = useAuthStore();
  const {
    currentProblem,
    setCurrentProblem,
    loading,
    error,
    setLoading,
    setError,
    clearError,
  } = useProblemsStore();
  const [activeTab, setActiveTab] = useState<
    "description" | "comments" | "results"
  >("description");
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        clearError();

        const slug = params.id as string;
        const response = await fetch(
          `http://localhost:5000/api/v1/problems/${slug}`,
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch problem: ${response.status}`);
        }

        const problemData: Problem = await response.json();
        setCurrentProblem(problemData);
      } catch (err) {
        console.error("Error fetching problem:", err);
        setError(err instanceof Error ? err.message : "Failed to load problem");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProblem();
    }
  }, [params.id, setCurrentProblem, setLoading, setError, clearError]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="text-destructive mb-4">
            <svg
              className="h-12 w-12 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Error loading problem
          </h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!currentProblem) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Problem not found
          </h3>
          <p className="text-muted-foreground mb-4">
            The problem you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/problems">Back to Problems</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmissionResult = (result: any) => {
    setSubmissionResult(result);
    setActiveTab("results");
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <ResizablePanelGroup direction="horizontal">
        {/* Left Panel - Problem Description */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col">
            <div className="border-b border-border">
              <div className="flex">
                <button
                  className={`px-4 py-2 text-sm font-medium border-b-2 ${
                    activeTab === "description"
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActiveTab("description")}
                >
                  Description
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium border-b-2 ${
                    activeTab === "comments"
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActiveTab("comments")}
                >
                  Comments ({currentProblem._count.discussions})
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium border-b-2 ${
                    activeTab === "results"
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActiveTab("results")}
                >
                  Results
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              {activeTab === "description" ? (
                <ProblemDescription problem={currentProblem} />
              ) : activeTab === "comments" ? (
                <ProblemComments problemId={currentProblem.id} />
              ) : (
                <SubmissionHistory problemId={currentProblem.id} />
              )}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right Panel - Code Editor */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col">
            {isAuthenticated ? (
              <CodeEditor
                problemId={currentProblem.id}
                problemTemplate={currentProblem.problemTemplate}
                testCases={currentProblem.testCases}
                onSubmissionResult={handleSubmissionResult}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-muted/30">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Sign in to start coding
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    You need to be logged in to access the code editor
                  </p>
                  <Button asChild>
                    <Link href="/auth">Sign In</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
