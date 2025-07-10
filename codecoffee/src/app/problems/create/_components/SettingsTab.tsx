import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CreateProblemsDto } from "@/types/problem";

interface SettingsTabProps {
  problem: CreateProblemsDto;
  setProblem: React.Dispatch<React.SetStateAction<CreateProblemsDto>>;
}

export function SettingsTab({ problem, setProblem }: SettingsTabProps) {
  return (
    <Card className="border-gray-200 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-black dark:text-white">
          Problem Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isPremium"
            checked={problem.isPremium}
            onChange={(e) =>
              setProblem((prev) => ({ ...prev, isPremium: e.target.checked }))
            }
            className="rounded"
          />
          <Label htmlFor="isPremium" className="text-black dark:text-white">
            Premium Problem
          </Label>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
            Additional Settings
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-400">
            More settings like publishing status, visibility, and editorial
            notes can be added here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
