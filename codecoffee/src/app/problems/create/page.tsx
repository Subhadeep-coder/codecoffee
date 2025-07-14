"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Save, FileText, Code, TestTube, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";

import { BasicInfoTab } from "./_components/BasicInfoTab";
import { TemplatesTab } from "./_components/TemplatesTab";
import { TestCasesTab } from "./_components/TestCasesTab";
import { SettingsTab } from "./_components/SettingsTab";
import { ProblemPreview } from "./_components/ProblemPreview";
import { CreateProblemsDto } from "../../../types/problem";

export default function CreatePage() {
  const router = useRouter();
  const [problem, setProblem] = useState<CreateProblemsDto>({
    title: "",
    description: "",
    difficulty: "Easy",
    tags: [],
    constraints: "",
    hints: [],
    companies: [],
    testCases: [
      { input: "", expectedOutput: "", isHidden: false, explanation: "" },
    ],
    isPremium: false,
    problemTemplates: [],
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const handleSave = async () => {
    setLoading(true);
    try {
      if (!problem.title.trim()) {
        toast.error("Title is required");
        return;
      }
      if (!problem.description.trim()) {
        toast.error("Description is required");
        return;
      }
      if (
        problem.testCases.length === 0 ||
        !problem.testCases[0].input.trim()
      ) {
        toast.error("At least one test case with input is required");
        return;
      }

      console.log("Submitting problem:", problem);
      const response = await api.post("/problems/create", problem);

      // Mock delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Problem created successfully!");

      // Reset form
      setProblem({
        title: "",
        description: "",
        difficulty: "Easy",
        tags: [],
        constraints: "",
        hints: [],
        companies: [],
        testCases: [
          { input: "", expectedOutput: "", isHidden: false, explanation: "" },
        ],
        isPremium: false,
        problemTemplates: [],
      });
      setActiveTab("basic");
      router.replace("/problems");
    } catch (error) {
      console.error("Error creating problem:", error);
      toast.error("Failed to create problem. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const tabsConfig = [
    { id: "basic", label: "Basic Info", icon: FileText },
    { id: "templates", label: "Code Templates", icon: Code },
    { id: "testcases", label: "Test Cases", icon: TestTube },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="p-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="space-y-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-4">
                  {tabsConfig.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="flex items-center gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                  <BasicInfoTab problem={problem} setProblem={setProblem} />
                </TabsContent>

                <TabsContent value="templates" className="space-y-6">
                  <TemplatesTab problem={problem} setProblem={setProblem} />
                </TabsContent>

                <TabsContent value="testcases" className="space-y-6">
                  <TestCasesTab problem={problem} setProblem={setProblem} />
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <SettingsTab problem={problem} setProblem={setProblem} />
                </TabsContent>
              </Tabs>

              {/* Create Button Section */}
              <div className="flex gap-4 pt-6">
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  size="lg"
                  className="flex-1 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Problem
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Preview Section */}
            <div className="space-y-6">
              <ProblemPreview problem={problem} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
