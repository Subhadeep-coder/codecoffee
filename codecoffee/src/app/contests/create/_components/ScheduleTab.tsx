"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CreateContestDto } from "@/types/contest";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClassicSchedule } from "./ClassicSchedule";
import { DurationSchedule } from "./DurationSchedule";

interface ScheduleTabProps {
  contest: CreateContestDto;
  setContest: React.Dispatch<React.SetStateAction<CreateContestDto>>;
}

export const ScheduleTab = ({ contest, setContest }: ScheduleTabProps) => {
  const [scheduleType, setScheduleType] = useState<"classic" | "duration">(
    "classic",
  );

  return (
    <Card className="border-gray-200">
      <CardContent className="space-y-6 p-6">
        <div>
          <Label className="text-sm font-medium text-black mb-3 block">
            Schedule Type
          </Label>
          <Select
            value={scheduleType}
            onValueChange={(value: "classic" | "duration") => {
              setScheduleType(value);
              // Reset contest schedule data when switching types
              setContest((prev) => ({
                ...prev,
                startTime: "",
                endTime: undefined,
                duration: "",
              }));
            }}
          >
            <SelectTrigger className="w-full border-gray-300 focus:border-black focus:ring-black">
              <SelectValue placeholder="Select schedule type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="classic">Classic</SelectItem>
              <SelectItem value="duration">Duration Based</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {scheduleType === "classic" ? (
          <ClassicSchedule contest={contest} setContest={setContest} />
        ) : (
          <DurationSchedule contest={contest} setContest={setContest} />
        )}
      </CardContent>
    </Card>
  );
};
