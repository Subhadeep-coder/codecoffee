import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Contest, ContestType } from "@/types/contest";

interface BasicInfoTabProps {
  contest: Contest;
  setContest: React.Dispatch<React.SetStateAction<Contest>>;
}

export const BasicInfoTab = ({ contest, setContest }: BasicInfoTabProps) => {
  const changeTitle = (title: string) => {
    setContest((prev) => ({
      ...prev,
      title: title,
    }));
  };

  const changeDesc = (desc: string) => {
    setContest((prev) => ({
      ...prev,
      description: desc,
    }));
  };

  const changeContestType = (type: ContestType) => {
    setContest((prev) => ({
      ...prev,
      type: type,
    }));
  };
  return (
    <Card className="border-gray-200 dark:border-gray-800">
      <CardContent className="space-y-6 p-6">
        <div>
          <Label htmlFor="title" className="text-sm font-medium text-black">
            Contest Title
          </Label>
          <Input
            id="title"
            placeholder="Enter contest title"
            value={contest.title}
            onChange={(e) => changeTitle(e.target.value)}
            className="mt-1 border-gray-300 focus:border-black focus:ring-black"
          />
        </div>

        <div>
          <Label
            htmlFor="description"
            className="text-sm font-medium text-black"
          >
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Describe your contest..."
            value={contest.description}
            onChange={(e) => changeDesc(e.target.value)}
            className="mt-1 border-gray-300 focus:border-black focus:ring-black"
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="type" className="text-sm font-medium text-black">
            Contest Type
          </Label>
          <Select
            value={contest.type}
            onValueChange={(value) => changeContestType(value as ContestType)}
          >
            <SelectTrigger className="mt-1 border-gray-300 focus:border-black focus:ring-black">
              <SelectValue placeholder="Select contest type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PUBLIC">Public</SelectItem>
              <SelectItem value="PRIVATE">Private</SelectItem>
              <SelectItem value="COMPANY">Company</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
