import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateContestDto } from "@/types/contest";

interface SettingsTabProps {
  contest: CreateContestDto;
  setContest: React.Dispatch<React.SetStateAction<CreateContestDto>>;
}

export const SettingsTab = ({ contest, setContest }: SettingsTabProps) => {
  const changeMaxParticipants = (maxP: string) => {
    setContest((prev) => ({
      ...prev,
      maxParticipants: maxP,
    }));
  };

  const changePenalty = (penalty: string) => {
    setContest((prev) => ({
      ...prev,
      penalty: penalty,
    }));
  };

  const changeRate = (rated: boolean) => {
    setContest((prev) => ({
      ...prev,
      isRated: rated,
    }));
  };
  return (
    <Card className="border-gray-200 dark:border-gray-800">
      <CardContent className="space-y-6 p-6">
        <div>
          <Label
            htmlFor="maxParticipants"
            className="text-sm font-medium text-black"
          >
            Maximum Participants
          </Label>
          <Input
            id="maxParticipants"
            type="number"
            min="1"
            max="10000"
            placeholder="Leave empty for unlimited"
            value={contest.maxParticipants}
            onChange={(e) => changeMaxParticipants(e.target.value)}
            className="mt-1 border-gray-300 focus:border-black focus:ring-black"
          />
        </div>

        <div>
          <Label htmlFor="penalty" className="text-sm font-medium text-black">
            Penalty per Wrong Submission (minutes)
          </Label>
          <Input
            id="penalty"
            type="number"
            min="0"
            max="60"
            placeholder="e.g., 20"
            value={contest.penalty}
            onChange={(e) => changePenalty(e.target.value)}
            className="mt-1 border-gray-300 focus:border-black focus:ring-black"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isRated"
            checked={contest.isRated}
            onCheckedChange={(checked) => changeRate(checked === true)}
            className="border-gray-300 data-[state=checked]:bg-black data-[state=checked]:border-black"
          />
          <Label htmlFor="isRated" className="text-sm font-medium text-black">
            Rated Contest
          </Label>
        </div>
      </CardContent>
    </Card>
  );
};
