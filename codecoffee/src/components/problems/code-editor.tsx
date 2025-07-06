"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { type ProblemTemplate, type TestCase } from "@/stores/problems-store";
import dynamic from "next/dynamic";
import { api } from "@/lib/axios";

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

interface CodeEditorProps {
  problemId: string;
  problemTemplate?: ProblemTemplate[];
  testCases?: TestCase[];
  onSubmissionResult?: (result: any) => void;
}

export function CodeEditor({
  problemId,
  problemTemplate,
  testCases,
  onSubmissionResult,
}: CodeEditorProps) {
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState("");
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [activeTestCase, setActiveTestCase] = useState("0");

  // Get available languages from problemTemplate
  const availableLanguages =
    problemTemplate?.map((template) => ({
      value: template.language,
      label: getLanguageLabel(template.language),
    })) || [];

  function getLanguageLabel(lang: string): string {
    switch (lang) {
      case "cpp":
        return "C++";
      case "java":
        return "Java";
      case "python":
        return "Python";
      case "javascript":
        return "JavaScript";
      case "typescript":
        return "TypeScript";
      case "c":
        return "C";
      case "csharp":
        return "C#";
      case "go":
        return "Go";
      case "rust":
        return "Rust";
      default:
        return lang.charAt(0).toUpperCase() + lang.slice(1);
    }
  }

  // Get Monaco editor language mapping
  function getMonacoLanguage(lang: string): string {
    switch (lang) {
      case "cpp":
        return "cpp";
      case "csharp":
        return "csharp";
      case "javascript":
        return "javascript";
      case "typescript":
        return "typescript";
      case "python":
        return "python";
      case "java":
        return "java";
      case "c":
        return "c";
      case "go":
        return "go";
      case "rust":
        return "rust";
      default:
        return "plaintext";
    }
  }

  // Decode base64 template
  const decodeTemplate = (template: string): string => {
    try {
      return atob(template);
    } catch (error) {
      console.error("Error decoding template:", error);
      return template; // Return original if decoding fails
    }
  };

  // Get template for current language
  const getCurrentTemplate = (): string => {
    const template = problemTemplate?.find((t) => t.language === language);
    return template ? decodeTemplate(template.template) : "";
  };

  // Initialize code when language changes or component mounts
  useEffect(() => {
    const template = getCurrentTemplate();
    if (template) {
      setCode(template);
    }
  }, [language, problemTemplate]);

  // Set default language when templates are loaded
  useEffect(() => {
    if (availableLanguages.length > 0 && !language) {
      setLanguage(availableLanguages[0].value);
    }
  }, [availableLanguages]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setOutput("");
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("Submitting code...");

    try {
      // First API call - create submission
      const createResponse = await api.post(
        "/submissions/create",
        {
          problemId: problemId,
          language: language,
          code: btoa(code),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      console.log("Response: ", createResponse);
      if (!createResponse) {
        throw new Error(`Failed to create submission: ${createResponse}`);
      }

      const { submissionId: newSubmissionId }: any = createResponse.data;
      setSubmissionId(newSubmissionId);
      setOutput("Code submitted. Waiting for results...");

      // Poll for results
      const pollForResults = async () => {
        const maxAttempts = 30; // 30 seconds timeout
        let attempts = 0;

        const poll = async () => {
          try {
            const resultResponse = await api.get(
              `/submissions/${newSubmissionId}`,
            );

            if (!resultResponse) {
              throw new Error(
                `Failed to get submission result: ${resultResponse.status}`,
              );
            }

            const result = resultResponse.data;

            console.log("Result of polling: ", result);

            if (
              result.status === "ACCEPTED" ||
              result.status === "WRONG_ANSWER" ||
              result.status === "RUNTIME_ERROR"
            ) {
              setSubmissionResult(result);

              if (onSubmissionResult) {
                onSubmissionResult(result);
              }

              // Format output based on result
              let outputText = `Status: ${result.status}\n`;
              outputText += `Runtime: ${result.runtime || "N/A"} ms\n`;
              outputText += `Memory: ${result.memory || "N/A"} MB\n\n`;

              if (result.testCases) {
                result.testCases.forEach((testCase: any, index: number) => {
                  outputText += `Test Case ${index + 1}: ${testCase.passed ? "Passed" : "Failed"}\n`;
                  if (!testCase.passed) {
                    outputText += `Expected: ${testCase.expected}\n`;
                    outputText += `Got: ${testCase.actual}\n`;
                  }
                  outputText += "\n";
                });
              }

              if (result.error) {
                outputText += `Error: ${result.error}\n`;
              }

              setOutput(outputText);
              setIsRunning(false);
              return;
            }

            attempts++;
            if (attempts < maxAttempts) {
              setTimeout(poll, 5000); // Poll every second
            } else {
              setOutput("Timeout: Results took too long to process");
              setIsRunning(false);
            }
          } catch (error) {
            console.error("Error polling for results:", error);
            setOutput(
              `Error getting results: ${error instanceof Error ? error.message : "Unknown error"}`,
            );
            setIsRunning(false);
          }
        };

        poll();
      };

      pollForResults();
    } catch (error) {
      console.error("Error submitting code:", error);
      setOutput(
        `Error: ${error instanceof Error ? error.message : "Failed to submit code"}`,
      );
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    const template = getCurrentTemplate();
    setCode(template);
    setOutput("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Editor Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableLanguages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button size="sm" onClick={handleRun} disabled={isRunning}>
              <Play className="h-4 w-4 mr-1" />
              {isRunning ? "Running..." : "Run Code"}
            </Button>
          </div>
        </div>
      </div>

      {/* Resizable Panels */}
      <ResizablePanelGroup direction="vertical" className="flex-1">
        {/* Code Editor Panel */}
        <ResizablePanel defaultSize={70} minSize={30}>
          <MonacoEditor
            height="100%"
            language={getMonacoLanguage(language)}
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: "on",
              scrollbar: {
                vertical: "visible",
                horizontal: "visible",
              },
            }}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Test Cases Panel */}
        <ResizablePanel defaultSize={30} minSize={20}>
          <div className="h-full flex flex-col">
            {/* Test Cases Header */}
            <div className="border-b border-border p-3">
              <h3 className="text-sm font-medium">
                Test Cases ({testCases?.length || 0})
              </h3>
            </div>

            {/* Test Cases Content */}
            <div className="flex-1 overflow-auto">
              {testCases && testCases.length > 0 ? (
                <Tabs
                  value={activeTestCase}
                  onValueChange={setActiveTestCase}
                  className="h-full"
                >
                  <TabsList className="grid w-full grid-cols-3 m-2">
                    {testCases.map((_, index) => (
                      <TabsTrigger key={index} value={index.toString()}>
                        Case {index + 1}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {testCases.map((testCase, index) => (
                    <TabsContent
                      key={index}
                      value={index.toString()}
                      className="p-4"
                    >
                      <div className="space-y-3">
                        <div>
                          <span className="text-xs font-medium text-muted-foreground">
                            Input:
                          </span>
                          <pre className="text-xs text-foreground font-mono bg-muted p-2 rounded mt-1">
                            {testCase.input}
                          </pre>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-muted-foreground">
                            Expected Output:
                          </span>
                          <pre className="text-xs text-foreground font-mono bg-muted p-2 rounded mt-1">
                            {testCase.expectedOutput}
                          </pre>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No test cases available
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Output Panel */}
      {output && (
        <div className="border-t border-border bg-muted/30 p-4 max-h-40 overflow-auto">
          <h3 className="text-sm font-semibold text-foreground mb-2">
            Output:
          </h3>
          <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
