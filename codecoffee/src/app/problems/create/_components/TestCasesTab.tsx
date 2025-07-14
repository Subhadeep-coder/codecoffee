import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { CreateProblemsDto, TestCaseDto } from "@/types/problem";

interface TestCasesTabProps {
  problem: CreateProblemsDto;
  setProblem: React.Dispatch<React.SetStateAction<CreateProblemsDto>>;
}

export function TestCasesTab({ problem, setProblem }: TestCasesTabProps) {
  const addTestCase = () => {
    setProblem((prev) => ({
      ...prev,
      testCases: [
        ...prev.testCases,
        { input: "", expectedOutput: "", isHidden: false, explanation: "" },
      ],
    }));
  };

  const removeTestCase = (index: number) => {
    setProblem((prev) => ({
      ...prev,
      testCases: prev.testCases.filter((_, i) => i !== index),
    }));
  };

  const updateTestCase = (
    index: number,
    field: keyof TestCaseDto,
    value: string | boolean,
  ) => {
    setProblem((prev) => ({
      ...prev,
      testCases: prev.testCases.map((tc, i) =>
        i === index ? { ...tc, [field]: value } : tc,
      ),
    }));
  };

  return (
    <Card className="border-gray-200 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg font-semibold text-black dark:text-white">
          Test Cases
          <Button size="sm" onClick={addTestCase}>
            <Plus className="h-4 w-4 mr-1" />
            Add Test Case
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {problem.testCases.map((testCase, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 space-y-3 bg-gray-50 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <Label className="font-medium text-black dark:text-white">
                Test Case {index + 1}
              </Label>
              <div className="flex items-center gap-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={testCase.isHidden}
                    onChange={(e) =>
                      updateTestCase(index, "isHidden", e.target.checked)
                    }
                    className="rounded"
                  />
                  <Label className="text-sm text-black dark:text-white">
                    Hidden
                  </Label>
                </div>
                {problem.testCases.length > 1 && (
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => removeTestCase(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div>
              <Label className="font-medium text-black dark:text-white">
                Input
              </Label>
              <Textarea
                value={testCase.input}
                onChange={(e) => updateTestCase(index, "input", e.target.value)}
                placeholder="Enter test input..."
                className="font-mono mt-1"
              />
            </div>

            <div>
              <Label className="font-medium text-black dark:text-white">
                Expected Output
              </Label>
              <Textarea
                value={testCase.expectedOutput}
                onChange={(e) =>
                  updateTestCase(index, "expectedOutput", e.target.value)
                }
                placeholder="Enter expected output..."
                className="font-mono mt-1"
              />
            </div>

            <div>
              <Label className="font-medium text-black dark:text-white">
                Explanation
              </Label>
              <Textarea
                value={testCase.explanation}
                onChange={(e) =>
                  updateTestCase(index, "explanation", e.target.value)
                }
                placeholder="Enter explanation for this test case..."
                className="mt-1"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
