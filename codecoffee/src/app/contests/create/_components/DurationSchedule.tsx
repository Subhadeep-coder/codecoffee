"use client";

import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Contest } from "@/types/contest";

interface DurationScheduleProps {
  contest: Contest;
  setContest: React.Dispatch<React.SetStateAction<Contest>>;
}

export const DurationSchedule = ({
  contest,
  setContest,
}: DurationScheduleProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    contest.startTime ? new Date(contest.startTime) : undefined,
  );

  const [startTime, setStartTime] = useState(
    contest.startTime
      ? new Date(contest.startTime).toTimeString().slice(0, 5)
      : "09:00",
  );

  const [duration, setDuration] = useState(contest.duration || "180");

  const calculateEndTime = (
    date: Date,
    time: string,
    durationMinutes: number,
  ) => {
    const startDateTime = new Date(date);
    const [hours, minutes] = time.split(":");
    startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const endDateTime = new Date(
      startDateTime.getTime() + durationMinutes * 60000,
    );
    return endDateTime;
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);

    if (date) {
      const startDateTime = new Date(date);
      const [hours, minutes] = startTime.split(":");
      startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const endDateTime = calculateEndTime(date, startTime, parseInt(duration));

      setContest((prev) => ({
        ...prev,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        duration: duration,
      }));
    }
  };

  const handleStartTimeChange = (time: string) => {
    setStartTime(time);

    if (selectedDate) {
      const startDateTime = new Date(selectedDate);
      const [hours, minutes] = time.split(":");
      startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const endDateTime = calculateEndTime(
        selectedDate,
        time,
        parseInt(duration),
      );

      setContest((prev) => ({
        ...prev,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
      }));
    }
  };

  const handleDurationChange = (durationValue: string) => {
    setDuration(durationValue);

    if (selectedDate) {
      const endDateTime = calculateEndTime(
        selectedDate,
        startTime,
        parseInt(durationValue),
      );

      setContest((prev) => ({
        ...prev,
        duration: durationValue,
        endTime: endDateTime.toISOString(),
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium text-black mb-3 block">
          Contest Date
        </Label>
        <div className="border border-gray-200 rounded-lg p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateChange}
            initialFocus
            disabled={(date) => date < new Date()}
            className="rounded-md border-0"
          />
        </div>
        {selectedDate && (
          <p className="text-sm text-gray-600 mt-2">
            Selected date: {selectedDate.toDateString()}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-sm font-medium text-black mb-2 block">
            Start Time
          </Label>
          <div className="space-y-2">
            <Input
              type="time"
              value={startTime}
              onChange={(e) => handleStartTimeChange(e.target.value)}
              className="border-gray-300 focus:border-black focus:ring-black"
            />
            {contest.startTime && (
              <p className="text-xs text-gray-500">
                Full start time: {new Date(contest.startTime).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-black mb-2 block">
            Duration (minutes)
          </Label>
          <div className="space-y-2">
            <Input
              type="number"
              min="1"
              max="1440"
              placeholder="e.g., 180"
              value={duration}
              onChange={(e) => handleDurationChange(e.target.value)}
              className="border-gray-300 focus:border-black focus:ring-black"
            />
            <p className="text-xs text-gray-500">
              Maximum 24 hours (1440 minutes)
            </p>
          </div>
        </div>
      </div>

      {/* Contest Schedule Summary */}
      {contest.startTime && contest.endTime && contest.duration && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-black mb-2">
            Contest Schedule Summary
          </h4>
          <div className="space-y-1 text-sm text-gray-600">
            <div>
              <span className="font-medium">Start:</span>{" "}
              {new Date(contest.startTime).toLocaleString()}
            </div>
            <div>
              <span className="font-medium">End:</span>{" "}
              {new Date(contest.endTime).toLocaleString()}
            </div>
            <div>
              <span className="font-medium">Duration:</span> {contest.duration}{" "}
              minutes
            </div>
            <div>
              <span className="font-medium">ISO Start:</span>{" "}
              {contest.startTime}
            </div>
            <div>
              <span className="font-medium">ISO End:</span> {contest.endTime}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
