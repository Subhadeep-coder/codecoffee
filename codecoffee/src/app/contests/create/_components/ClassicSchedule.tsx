"use client";

import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateContestDto } from "@/types/contest";
import { DateRange } from "react-day-picker";

interface ClassicScheduleProps {
  contest: CreateContestDto;
  setContest: React.Dispatch<React.SetStateAction<CreateContestDto>>;
}

export const ClassicSchedule = ({
  contest,
  setContest,
}: ClassicScheduleProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: contest.startTime ? new Date(contest.startTime) : undefined,
    to: contest.endTime ? new Date(contest.endTime) : undefined,
  });

  const [startTime, setStartTime] = useState(
    contest.startTime
      ? new Date(contest.startTime).toTimeString().slice(0, 5)
      : "09:00",
  );

  const [endTime, setEndTime] = useState(
    contest.endTime
      ? new Date(contest.endTime).toTimeString().slice(0, 5)
      : "12:00",
  );

  const calculateDuration = (
    start: string,
    end: string,
    startDate: Date,
    endDate: Date,
  ) => {
    const startDateTime = new Date(startDate);
    const [startHours, startMinutes] = start.split(":");
    startDateTime.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);

    const endDateTime = new Date(endDate);
    const [endHours, endMinutes] = end.split(":");
    endDateTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);

    const durationMs = endDateTime.getTime() - startDateTime.getTime();
    return Math.floor(durationMs / (1000 * 60)); // Convert to minutes
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);

    if (range?.from && range?.to) {
      const startDateTime = new Date(range.from);
      const [startHours, startMinutes] = startTime.split(":");
      startDateTime.setHours(
        parseInt(startHours),
        parseInt(startMinutes),
        0,
        0,
      );

      const endDateTime = new Date(range.to);
      const [endHours, endMinutes] = endTime.split(":");
      endDateTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);

      const duration = calculateDuration(
        startTime,
        endTime,
        range.from,
        range.to,
      );

      setContest((prev) => ({
        ...prev,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        duration: duration.toString(),
      }));
    }
  };

  const handleStartTimeChange = (time: string) => {
    setStartTime(time);

    if (dateRange?.from && dateRange?.to) {
      const startDateTime = new Date(dateRange.from);
      const [hours, minutes] = time.split(":");
      startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const duration = calculateDuration(
        time,
        endTime,
        dateRange.from,
        dateRange.to,
      );

      setContest((prev) => ({
        ...prev,
        startTime: startDateTime.toISOString(),
        duration: duration.toString(),
      }));
    }
  };

  const handleEndTimeChange = (time: string) => {
    setEndTime(time);

    if (dateRange?.from && dateRange?.to) {
      const endDateTime = new Date(dateRange.to);
      const [hours, minutes] = time.split(":");
      endDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const duration = calculateDuration(
        startTime,
        time,
        dateRange.from,
        dateRange.to,
      );

      setContest((prev) => ({
        ...prev,
        endTime: endDateTime.toISOString(),
        duration: duration.toString(),
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium text-black mb-3 block">
          Contest Date Range
        </Label>
        <div className="border border-gray-200 rounded-lg p-4">
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
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
                Full start time: {new Date(contest.startTime).toLocaleString()}
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
