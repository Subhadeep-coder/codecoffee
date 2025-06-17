"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type SubmissionStatus = "Accepted" | "Wrong Answer" | "Time Limit Exceeded" | "Runtime Error" | null

interface TestCase {
  input: string
  expectedOutput: string
  actualOutput?: string
  passed?: boolean
}

interface SubmissionResultProps {
  status: SubmissionStatus
  runtime?: string
  memory?: string
  testCases?: TestCase[]
  output?: string
  error?: string
}

export function SubmissionResult({
  status,
  runtime,
  memory,
  testCases = [],
  output = "",
  error = "",
}: SubmissionResultProps) {
  const [activeTab, setActiveTab] = useState("output")

  if (!status) return null

  const statusConfig = {
    Accepted: {
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    "Wrong Answer": {
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
    },
    "Time Limit Exceeded": {
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
    },
    "Runtime Error": {
      icon: AlertCircle,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
  }

  const StatusIcon = statusConfig[status].icon

  return (
    <div className="space-y-4">
      <Alert className={cn("border", statusConfig[status].bgColor, statusConfig[status].borderColor)}>
        <StatusIcon className={cn("h-5 w-5", statusConfig[status].color)} />
        <AlertTitle className="flex items-center gap-2">
          {status}
          {runtime && (
            <Badge variant="outline" className="ml-2">
              Runtime: {runtime}
            </Badge>
          )}
          {memory && <Badge variant="outline">Memory: {memory}</Badge>}
        </AlertTitle>
        <AlertDescription>
          {status === "Accepted"
            ? "Your solution passed all test cases!"
            : status === "Wrong Answer"
              ? "Your solution produced incorrect output for one or more test cases."
              : status === "Time Limit Exceeded"
                ? "Your solution took too long to execute."
                : "Your solution encountered a runtime error during execution."}
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="output">Output</TabsTrigger>
          <TabsTrigger value="testcases">Test Cases</TabsTrigger>
          <TabsTrigger value="expected">Expected</TabsTrigger>
        </TabsList>
        <TabsContent value="output" className="space-y-4">
          <div className="rounded-md border bg-muted/50 p-4 font-mono text-sm overflow-auto max-h-[300px]">
            {error ? (
              <pre className="text-red-500">{error}</pre>
            ) : output ? (
              <pre>{output}</pre>
            ) : (
              <p className="text-muted-foreground">No output available</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="testcases">
          <div className="space-y-4">
            {testCases.length > 0 ? (
              testCases.map((testCase, index) => (
                <div key={index} className="rounded-md border p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Test Case {index + 1}</h4>
                    {testCase.passed !== undefined && (
                      <Badge
                        variant="outline"
                        className={
                          testCase.passed
                            ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                            : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                        }
                      >
                        {testCase.passed ? "Passed" : "Failed"}
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Input:</p>
                      <pre className="text-xs bg-muted/50 p-2 rounded-md overflow-auto max-h-[100px]">
                        {testCase.input}
                      </pre>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Your Output:</p>
                      <pre className="text-xs bg-muted/50 p-2 rounded-md overflow-auto max-h-[100px]">
                        {testCase.actualOutput || "No output"}
                      </pre>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No test cases available</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="expected">
          <div className="space-y-4">
            {testCases.length > 0 ? (
              testCases.map((testCase, index) => (
                <div key={index} className="rounded-md border p-4 space-y-2">
                  <h4 className="font-medium">Test Case {index + 1}</h4>
                  <div>
                    <p className="text-sm font-medium mb-1">Input:</p>
                    <pre className="text-xs bg-muted/50 p-2 rounded-md overflow-auto max-h-[100px]">
                      {testCase.input}
                    </pre>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Expected Output:</p>
                    <pre className="text-xs bg-muted/50 p-2 rounded-md overflow-auto max-h-[100px]">
                      {testCase.expectedOutput}
                    </pre>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No expected outputs available</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
