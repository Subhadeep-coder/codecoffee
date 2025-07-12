"use client";

import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Contest } from "@/types/contest";
import { DateRange } from "react-day-picker";

interface ScheduleTabProps {
  contest: Contest;
  setContest: React.Dispatch<React.SetStateAction<Contest>>;
}

export const ScheduleTab = ({ contest, setContest }: ScheduleTabProps) => {
  const [dateRange, setDateRange] = useState({
    from: contest.startTime ? new Date(contest.startTime) : undefined,
    to: contest.endTime ? new Date(contest.endTime) : undefined,
  });

  const [startTime, setStartTime] = useState(
    contest.startTime
      ? new Date(contest.startTime).toISOString()
      : "2025-07-12T21:57:31.102Z",
  );

  const [endTime, setEndTime] = useState(
    contest.endTime
      ? new Date(contest.endTime).toISOString()
      : "2025-07-15T21:57:31.000Z",
  );

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange({
      from: range?.from,
      to: range?.to,
    });

    if (range?.from) {
      const startDateTime = new Date(range.from);
      const [hours, minutes] = startTime.split(":");
      startDateTime.setHours(parseInt(hours), parseInt(minutes));

      setContest((prev) => ({
        ...prev,
        startTime: startDateTime.toISOString(),
      }));
    }

    if (range?.to) {
      const endDateTime = new Date(range.to);
      const [hours, minutes] = endTime.split(":");
      endDateTime.setHours(parseInt(hours), parseInt(minutes));

      setContest((prev) => ({
        ...prev,
        endTime: endDateTime.toISOString(),
      }));
    }
  };

  const handleStartTimeChange = (time: string) => {
    setStartTime(time);

    if (dateRange?.from) {
      const startDateTime = new Date(dateRange.from);
      const [hours, minutes] = time.split(":");
      startDateTime.setHours(parseInt(hours), parseInt(minutes));

      setContest((prev) => ({
        ...prev,
        startTime: startDateTime.toISOString(),
      }));
    }
  };

  const handleEndTimeChange = (time: string) => {
    setEndTime(time);

    if (dateRange?.to) {
      const endDateTime = new Date(dateRange.to);
      const [hours, minutes] = time.split(":");
      endDateTime.setHours(parseInt(hours), parseInt(minutes));

      setContest((prev) => ({
        ...prev,
        endTime: endDateTime.toISOString(),
      }));
    }
  };

  const handleDurationChange = (duration: string) => {
    setContest((prev) => ({
      ...prev,
      duration: duration,
    }));
  };

  return (
    <Card className="border-gray-200">
      <CardContent className="space-y-6 p-6">
        <div>
          <Label className="text-sm font-medium text-black mb-3 block">
            Contest Date Range
          </Label>
          <div className="border border-gray-200 rounded-lg p-4">
            <Calendar
              mode="range"
              defaultMonth={dateRange.from}
              selected={dateRange}
              onSelect={handleDateRangeChange}
              numberOfMonths={2}
              initialFocus
              disabled={(date) => date < new Date()}
              className="rounded-md border-0"
            />
          </div>
          {dateRange?.from && (
            <p className="text-sm text-gray-600 mt-2">
              {dateRange.to ? (
                <>
                  Selected: {dateRange.from.toDateString()} -{" "}
                  {dateRange.to.toDateString()}
                </>
              ) : (
                <>
                  Start date: {dateRange.from.toDateString()}. Please select an
                  end date.
                </>
              )}
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
                  Full start time:{" "}
                  {new Date(contest.startTime).toLocaleString()}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-black mb-2 block">
              End Time
            </Label>
            <div className="space-y-2">
              <Input
                type="time"
                value={endTime}
                onChange={(e) => handleEndTimeChange(e.target.value)}
                className="border-gray-300 focus:border-black focus:ring-black"
              />
              {contest.endTime && (
                <p className="text-xs text-gray-500">
                  Full end time: {new Date(contest.endTime).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="duration" className="text-sm font-medium text-black">
            Duration (minutes)
          </Label>
          <Input
            id="duration"
            type="number"
            min="1"
            max="1440"
            placeholder="e.g., 180"
            value={contest.duration}
            onChange={(e) => handleDurationChange(e.target.value)}
            className="mt-1 border-gray-300 focus:border-black focus:ring-black"
          />
          <p className="text-sm text-gray-500 mt-1">
            Maximum 24 hours (1440 minutes)
          </p>
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
                <span className="font-medium">Duration:</span>{" "}
                {contest.duration} minutes
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
      </CardContent>
    </Card>
  );
};
