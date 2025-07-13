"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ContestsTable } from "@/components/contests/contests-table";
import { X } from "lucide-react";

export interface FilterTypes {
  type: string[];
  status: string;
  rated: string;
}

export default function ContestsPage() {
  const [filters, setFilters] = useState<FilterTypes>({
    type: [],
    status: "all",
    rated: "all",
  });

  const handleTypeChange = (value: string) => {
    if (value === "all") {
      setFilters((prev) => ({ ...prev, type: [] }));
    } else {
      setFilters((prev) => ({
        ...prev,
        type: prev.type.includes(value)
          ? prev.type.filter((t) => t !== value)
          : [...prev.type, value],
      }));
    }
  };

  const handleStatusChange = (value: string) => {
    setFilters((prev) => ({ ...prev, status: value }));
  };

  const handleRatedChange = (value: string) => {
    setFilters((prev) => ({ ...prev, rated: value }));
  };

  const removeTypeFilter = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      type: prev.type.filter((t) => t !== type),
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      type: [],
      status: "all",
      rated: "all",
    });
  };

  const hasActiveFilters =
    filters.type.length > 0 ||
    filters.status !== "all" ||
    filters.rated !== "all";

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contests</h1>
          <p className="text-muted-foreground mt-1">
            Participate in programming contests and improve your skills
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Type:</label>
              <Select onValueChange={handleTypeChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Contest type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="PUBLIC">Public</SelectItem>
                  <SelectItem value="PRIVATE">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Status:</label>
              <Select value={filters.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="ended">Ended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Rating:</label>
              <Select value={filters.rated} onValueChange={handleRatedChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="rated">Rated</SelectItem>
                  <SelectItem value="unrated">Unrated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="h-8"
              >
                Clear All
              </Button>
            )}
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4">
              {filters.type.map((type) => (
                <Badge
                  key={type}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {type}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeTypeFilter(type)}
                  />
                </Badge>
              ))}
              {filters.status !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Status: {filters.status}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleStatusChange("all")}
                  />
                </Badge>
              )}
              {filters.rated !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {filters.rated === "rated" ? "Rated" : "Unrated"}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleRatedChange("all")}
                  />
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contests Table */}
      <ContestsTable filters={filters} />
    </div>
  );
}
