"use client";

import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth-store";
import { CheckCircle, XCircle, Clock, AlertCircle, Code } from "lucide-react";
import { useEffect, useState } from "react";

interface Submission {
  id: string;
  userId: string;
  problemId: string;
  language: string;
  status: string;
  runtime: number | null;
  memory: number | null;
  testCasesPassed: number;
  totalTestCases: number;
  errorMessage: string | null;
  judge0Token: string | null;
  submittedAt: string;
}

interface SubmissionHistoryProps {
  problemId: string;
}

export function SubmissionHistory({ problemId }: SubmissionHistoryProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <XCircle className="h-8 w-8 mx-auto mb-2" />
        <p>Please log in to view your submissions</p>
      </div>
    );
  }

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await api.get(`/submissions/get-me/${problemId}`);
        const data = response.data;
        setSubmissions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [problemId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "WRONG_ANSWER":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "RUNTIME_ERROR":
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case "INTERNAL_ERROR":
        return <AlertCircle className="h-5 w-5 text-purple-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "WRONG_ANSWER":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "RUNTIME_ERROR":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "INTERNAL_ERROR":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getLanguageColor = (language: string) => {
    switch (language.toLowerCase()) {
      case "cpp":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "java":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "python":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "javascript":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <Clock className="h-8 w-8 mx-auto mb-2 animate-spin" />
        <p>Loading submissions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <XCircle className="h-8 w-8 mx-auto mb-2" />
        <p>Error loading submissions: {error}</p>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <Code className="h-8 w-8 mx-auto mb-2" />
        <p>No submissions yet</p>
        <p className="text-sm">Your submission history will appear here</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Submission History
        </h2>
        <p className="text-sm text-muted-foreground">
          {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="space-y-4">
        {submissions.map((submission, index) => (
          <div
            key={submission.id}
            className="border rounded-lg p-4 bg-card hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {getStatusIcon(submission.status)}
                <div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(submission.status)}>
                      {submission.status.replace("_", " ")}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={getLanguageColor(submission.language)}
                    >
                      {submission.language.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {formatDate(submission.submittedAt)}
                  </div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                #{submissions.length - index}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground">Test Cases</div>
                <div className="text-sm font-semibold text-foreground">
                  {submission.testCasesPassed}/{submission.totalTestCases}
                </div>
              </div>

              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground">Runtime</div>
                <div className="text-sm font-semibold text-foreground">
                  {submission.runtime ? `${submission.runtime}ms` : "N/A"}
                </div>
              </div>

              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground">Memory</div>
                <div className="text-sm font-semibold text-foreground">
                  {submission.memory ? `${submission.memory}MB` : "N/A"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
