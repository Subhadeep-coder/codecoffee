import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Code, Hash } from "lucide-react";
import {
  CreateProblemsDto,
  ProblemTemplateDto,
  PROGRAMMING_LANGUAGES,
} from "@/types/problem";
import { MonacoCodeEditor } from "./Editor";

interface TemplatesTabProps {
  problem: CreateProblemsDto;
  setProblem: React.Dispatch<React.SetStateAction<CreateProblemsDto>>;
}

export function TemplatesTab({ problem, setProblem }: TemplatesTabProps) {
  // Ensure at least one template exists
  useEffect(() => {
    if (!problem.problemTemplates || problem.problemTemplates.length === 0) {
      setProblem((prev) => ({
        ...prev,
        problemTemplates: [
          {
            language: "JavaScript",
            template: "",
            templateIdentifier: "javascript-starter",
          },
        ],
      }));
    }
  }, [problem.problemTemplates, setProblem]);

  const addTemplate = () => {
    const existingLanguages =
      problem.problemTemplates?.map((t) => t.language) || [];
    const availableLanguages = PROGRAMMING_LANGUAGES.filter(
      (lang) => !existingLanguages.includes(lang),
    );

    const nextLanguage =
      availableLanguages.length > 0 ? availableLanguages[0] : "JavaScript";

    // Generate default identifier based on language
    const defaultIdentifier =
      nextLanguage.toLowerCase().replace(/\s+/g, "-") + "-starter";

    setProblem((prev) => ({
      ...prev,
      problemTemplates: [
        ...(prev.problemTemplates || []),
        {
          language: nextLanguage,
          template: "",
          templateIdentifier: defaultIdentifier,
        },
      ],
    }));
  };

  const removeTemplate = (index: number) => {
    // Don't allow removing the last template
    if (problem.problemTemplates && problem.problemTemplates.length <= 1) {
      return;
    }

    setProblem((prev) => ({
      ...prev,
      problemTemplates:
        prev.problemTemplates?.filter((_, i) => i !== index) || [],
    }));
  };

  const updateTemplate = (
    index: number,
    field: keyof ProblemTemplateDto,
    value: string,
  ) => {
    setProblem((prev) => ({
      ...prev,
      problemTemplates:
        prev.problemTemplates?.map((template, i) =>
          i === index ? { ...template, [field]: value } : template,
        ) || [],
    }));
  };

  const getAvailableLanguages = (currentIndex: number) => {
    const currentTemplate = problem.problemTemplates?.[currentIndex];
    const otherLanguages =
      problem.problemTemplates
        ?.filter((_, i) => i !== currentIndex)
        .map((t) => t.language) || [];

    return PROGRAMMING_LANGUAGES.filter(
      (lang) =>
        !otherLanguages.includes(lang) || lang === currentTemplate?.language,
    );
  };

  const validateIdentifier = (identifier: string) => {
    // Check if identifier is unique
    const identifiers =
      problem.problemTemplates?.map((t) => t.templateIdentifier) || [];
    const count = identifiers.filter((id) => id === identifier).length;
    return count <= 1;
  };

  const formatIdentifier = (value: string) => {
    // Auto-format identifier to be URL-friendly
    return value
      .toLowerCase()
      .replace(/[^a-z0-9\-_]/g, "-")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  return (
    <Card className="border-gray-200 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg font-semibold text-black dark:text-white">
          Code Templates
          <Button size="sm" onClick={addTemplate}>
            <Plus className="h-4 w-4 mr-1" />
            Add Template
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {problem.problemTemplates && problem.problemTemplates.length > 0 ? (
          problem.problemTemplates.map((template, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <Label className="font-medium text-black dark:text-white">
                  Template {index + 1}
                </Label>
                <div className="flex items-center gap-2">
                  {problem.problemTemplates &&
                    problem.problemTemplates.length > 1 && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeTemplate(index)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium text-black dark:text-white mb-2 block">
                    Programming Language
                  </Label>
                  <select
                    value={template.language}
                    onChange={(e) => {
                      updateTemplate(index, "language", e.target.value);
                      // Auto-update identifier when language changes
                      const newIdentifier =
                        e.target.value.toLowerCase().replace(/\s+/g, "-") +
                        "-starter";
                      updateTemplate(
                        index,
                        "templateIdentifier",
                        newIdentifier,
                      );
                    }}
                    className="w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  >
                    {getAvailableLanguages(index).map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="font-medium text-black dark:text-white mb-2 block">
                    <Hash className="h-4 w-4 inline mr-1" />
                    Template Identifier
                  </Label>
                  <Input
                    value={template.templateIdentifier || ""}
                    onChange={(e) => {
                      const formatted = formatIdentifier(e.target.value);
                      updateTemplate(index, "templateIdentifier", formatted);
                    }}
                    placeholder="e.g., javascript-starter"
                    className={`${
                      !validateIdentifier(template.templateIdentifier || "")
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                  />
                  {!validateIdentifier(template.templateIdentifier || "") && (
                    <p className="text-red-500 text-xs mt-1">
                      Identifier must be unique
                    </p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    Unique identifier for this template (auto-formatted)
                  </p>
                </div>
              </div>

              <div>
                <Label className="font-medium text-black dark:text-white mb-2 block">
                  Starter Code
                </Label>
                <MonacoCodeEditor
                  value={template.template}
                  onChange={(value) => updateTemplate(index, "template", value)}
                  language={template.language}
                  placeholder={`// Write your ${template.language} starter code here...
// This will be provided to users as a starting point`}
                  height={350}
                  theme="vs-dark"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <Code className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">Template Tips:</p>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                      <li>Include function signatures and basic structure</li>
                      <li>Add helpful comments to guide users</li>
                      <li>Use meaningful variable names</li>
                      <li>Consider adding example usage in comments</li>
                      <li>Ensure the identifier is unique and descriptive</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Loading templates...</p>
          </div>
        )}

        {problem.problemTemplates && problem.problemTemplates.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              Template Guidelines
            </h4>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p>• Provide a clear starting structure for users</p>
              <p>• Include necessary imports and function signatures</p>
              <p>• Add comments explaining expected input/output format</p>
              <p>
                • Consider different skill levels - from beginner to advanced
              </p>
              <p>• Test your templates to ensure they work correctly</p>
              <p>• Use unique, descriptive identifiers for each template</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
