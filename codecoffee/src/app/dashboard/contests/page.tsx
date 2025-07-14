"use client";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Trophy, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";

interface Contest {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  type: "PUBLIC" | "PRIVATE";
  startTime: string;
  endTime: string;
  duration: number;
  maxParticipants: number;
  isRated: boolean;
  penalty: number;
  createdAt: string;
  updatedAt: string;
}

export default function ContestsPage() {
  const router = useRouter();
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = true;

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await api.get("/contests/get/me");
        const data = response.data;
        setContests(data);
      } catch (error) {
        console.error("Error fetching contests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  const getContestStatus = (startTime: string, endTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) {
      return {
        status: "upcoming",
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      };
    } else if (now >= start && now <= end) {
      return {
        status: "live",
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      };
    } else {
      return {
        status: "ended",
        color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      };
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "PUBLIC":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300";
      case "PRIVATE":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  const handleCreateContest = () => {
    console.log("Create new contest");
    router.push("/contests/create");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-black dark:text-white">Loading contests...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            My Contests
          </h1>
          <Button
            onClick={handleCreateContest}
            className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Contest
          </Button>
        </div>

        {/* Contests Table */}
        <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Start Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Participants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {contests.map((contest) => {
                  const contestStatus = getContestStatus(
                    contest.startTime,
                    contest.endTime,
                  );
                  return (
                    <tr
                      key={contest.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={contestStatus.color}>
                          {contestStatus.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/contests/${contest.id}`}
                          className="text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 font-medium transition-colors"
                        >
                          {contest.title}
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {contest.description}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getTypeColor(contest.type)}>
                          {contest.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDuration(contest.duration)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDateTime(contest.startTime)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {contest.maxParticipants}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Trophy className="h-4 w-4 mr-1" />
                          {contest.isRated ? (
                            <span className="text-yellow-600 dark:text-yellow-400">
                              Rated
                            </span>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">
                              Unrated
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isAuthenticated && (
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                router.push(`/contests/${contest.id}`)
                              }
                              className="hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                router.push(`/contests/${contest.id}/edit`)
                              }
                              className="hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              Edit
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {contests.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No contests yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Create your first contest to get started.
            </p>
            <Button
              onClick={handleCreateContest}
              className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Contest
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
