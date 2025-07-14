import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { CreateProblemsDto } from "@/types/problem";

interface BasicInfoTabProps {
  problem: CreateProblemsDto;
  setProblem: React.Dispatch<React.SetStateAction<CreateProblemsDto>>;
}

export function BasicInfoTab({ problem, setProblem }: BasicInfoTabProps) {
  const [tagInput, setTagInput] = useState("");
  const [hintInput, setHintInput] = useState("");
  const [companyInput, setCompanyInput] = useState("");

  const addTag = () => {
    if (tagInput.trim() && !problem.tags.includes(tagInput.trim())) {
      setProblem((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setProblem((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addHint = () => {
    if (hintInput.trim()) {
      setProblem((prev) => ({
        ...prev,
        hints: [...prev.hints, hintInput.trim()],
      }));
      setHintInput("");
    }
  };

  const removeHint = (index: number) => {
    setProblem((prev) => ({
      ...prev,
      hints: prev.hints.filter((_, i) => i !== index),
    }));
  };

  const addCompany = () => {
    if (
      companyInput.trim() &&
      !problem.companies.includes(companyInput.trim())
    ) {
      setProblem((prev) => ({
        ...prev,
        companies: [...prev.companies, companyInput.trim()],
      }));
      setCompanyInput("");
    }
  };

  const removeCompany = (companyToRemove: string) => {
    setProblem((prev) => ({
      ...prev,
      companies: prev.companies.filter(
        (company) => company !== companyToRemove,
      ),
    }));
  };

  return (
    <Card className="border-gray-200 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-black dark:text-white">
          Problem Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label
            htmlFor="title"
            className="font-medium text-black dark:text-white"
          >
            Title
          </Label>
          <Input
            id="title"
            value={problem.title}
            onChange={(e) =>
              setProblem((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Enter problem title"
            className="mt-1"
          />
        </div>

        <div>
          <Label
            htmlFor="difficulty"
            className="font-medium text-black dark:text-white"
          >
            Difficulty
          </Label>
          <select
            id="difficulty"
            value={problem.difficulty}
            onChange={(e) =>
              setProblem((prev) => ({ ...prev, difficulty: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-black dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div>
          <Label
            htmlFor="description"
            className="font-medium text-black dark:text-white"
          >
            Description (Markdown)
          </Label>
          <Textarea
            id="description"
            value={problem.description}
            onChange={(e) =>
              setProblem((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Enter problem description in Markdown format..."
            className="min-h-[200px] font-mono mt-1"
          />
        </div>

        <div>
          <Label
            htmlFor="constraints"
            className="font-medium text-black dark:text-white"
          >
            Constraints
          </Label>
          <Textarea
            id="constraints"
            value={problem.constraints}
            onChange={(e) =>
              setProblem((prev) => ({ ...prev, constraints: e.target.value }))
            }
            placeholder="Enter problem constraints..."
            className="min-h-[100px] font-mono mt-1"
          />
        </div>

        {/* Tags */}
        <div>
          <Label className="font-medium text-black dark:text-white">Tags</Label>
          <div className="flex gap-2 mt-1">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag"
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addTag())
              }
            />
            <Button onClick={addTag} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {problem.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {tag}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeTag(tag)}
                />
              </Badge>
            ))}
          </div>
        </div>

        {/* Companies */}
        <div>
          <Label className="font-medium text-black dark:text-white">
            Companies
          </Label>
          <div className="flex gap-2 mt-1">
            <Input
              value={companyInput}
              onChange={(e) => setCompanyInput(e.target.value)}
              placeholder="Add a company"
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addCompany())
              }
            />
            <Button onClick={addCompany} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {problem.companies.map((company, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {company}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeCompany(company)}
                />
              </Badge>
            ))}
          </div>
        </div>

        {/* Hints */}
        <div>
          <Label className="font-medium text-black dark:text-white">
            Hints
          </Label>
          <div className="flex gap-2 mt-1">
            <Input
              value={hintInput}
              onChange={(e) => setHintInput(e.target.value)}
              placeholder="Add a hint"
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addHint())
              }
            />
            <Button onClick={addHint} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2 mt-2">
            {problem.hints.map((hint, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded"
              >
                <span className="flex-1 text-sm">{hint}</span>
                <X
                  className="h-4 w-4 cursor-pointer text-red-500"
                  onClick={() => removeHint(index)}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
