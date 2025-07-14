"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Users,
  Trophy,
  Calendar,
  Target,
  Award,
  PlayCircle,
  CheckCircle,
  AlertCircle,
  Timer,
  Star,
  BookOpen,
  User,
} from "lucide-react";
import { api } from "@/lib/axios";

export default function ContestPage() {
  const params = useParams();
  const router = useRouter();
  const [contest, setContest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const id = params.id as string;

  useEffect(() => {
    const fetchContest = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/contests/${id}`);
        const data = response.data;
        setContest(data);
      } catch (err) {
        setError(err as any);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchContest();
    }
  }, [id]);

  useEffect(() => {
    if (!contest) return;

    const timer = setInterval(() => {
      const now = new Date();
      let targetTime: Date;

      if (contest.contestStatus === "NOT_STARTED") {
        targetTime = new Date(contest.startTime);
      } else if (contest.contestStatus === "RUNNING") {
        targetTime = new Date(contest.endTime);
      } else {
        setTimeLeft("Contest Ended");
        return;
      }

      const timeDiff = targetTime.getTime() - now.getTime();

      if (timeDiff <= 0) {
        if (contest.contestStatus === "NOT_STARTED") {
          setContest((prev: any) => ({ ...prev, contestStatus: "RUNNING" }));
        } else {
          setContest((prev: any) => ({ ...prev, contestStatus: "ENDED" }));
        }
        return;
      }

      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [contest]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contest...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error loading contest
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Contest not found
          </h2>
          <p className="text-gray-600">
            The contest you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-100 text-green-800 border-green-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "HARD":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = () => {
    switch (contest.contestStatus) {
      case "NOT_STARTED":
        return <Clock className="h-4 w-4" />;
      case "RUNNING":
        return <PlayCircle className="h-4 w-4" />;
      case "ENDED":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    switch (contest.contestStatus) {
      case "NOT_STARTED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "RUNNING":
        return "bg-green-100 text-green-800 border-green-200";
      case "ENDED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleRegister = async () => {
    // TODO: API CALL TO JOIN CONTEST
    const res = await api.post(`/contests/${id}/join`);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {contest.title}
            </h1>
            <Badge
              variant="outline"
              className={`px-3 py-1 ${getStatusColor()}`}
            >
              {getStatusIcon()}
              <span className="ml-2">
                {contest.contestStatus.replace("_", " ")}
              </span>
            </Badge>
          </div>

          <p className="text-gray-600 mb-6">{contest.description}</p>

          {/* Contest Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Timer className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold text-gray-900">
                      {contest.duration} min
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Participants</p>
                    <p className="font-semibold text-gray-900">
                      {contest.participantCount}/{contest.maxParticipants}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600">Rated</p>
                    <p className="font-semibold text-gray-900">
                      {contest.isRated ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Penalty</p>
                    <p className="font-semibold text-gray-900">
                      {contest.penalty} min
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Timer Section */}
        {contest.contestStatus !== "ENDED" && (
          <Card className="mb-8 border-gray-200">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  {contest.contestStatus === "NOT_STARTED"
                    ? "Contest starts in:"
                    : "Time remaining:"}
                </h3>
                <div className="text-3xl font-mono font-bold text-blue-600">
                  {timeLeft}
                </div>
                <Progress
                  value={contest.contestStatus === "NOT_STARTED" ? 0 : 65}
                  className="mt-4 w-full max-w-md mx-auto"
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Problems Section */}
          <div className="lg:col-span-2">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Problems
                </CardTitle>
              </CardHeader>
              <CardContent>
                {contest.canViewProblems ? (
                  <div className="space-y-4">
                    {contest.problems?.map(
                      (contestProblem: any, index: number) => (
                        <div
                          key={contestProblem.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <span className="font-semibold text-gray-900">
                                {String.fromCharCode(65 + index)}.{" "}
                                {contestProblem.problem.title}
                              </span>
                              <Badge
                                variant="outline"
                                className={getDifficultyColor(
                                  contestProblem.problem.difficulty,
                                )}
                              >
                                {contestProblem.problem.difficulty}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600">
                              {contestProblem.problem.acceptanceRate}%
                              acceptance
                            </div>
                          </div>

                          <p className="text-gray-600 mb-3">
                            {contestProblem.problem.description}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {contestProblem.problem.tags.map((tag: string) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>
                              {contestProblem.problem.acceptedSubmissions} /{" "}
                              {contestProblem.problem.totalSubmissions}{" "}
                              submissions
                            </span>
                            <Button variant="outline" size="sm">
                              Solve Problem
                            </Button>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Problems will be visible when the contest starts</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contest Creator */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <User className="h-5 w-5 mr-2" />
                  Contest Creator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage
                      src={contest.creator.avatar}
                      alt={contest.creator.username}
                    />
                    <AvatarFallback className="bg-gray-100 text-gray-600">
                      {contest?.creator?.firstName || ""}
                      {contest?.creator?.lastName || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {contest.creator.firstName} {contest.creator.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      @{contest.creator.username}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contest Actions */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {contest.userRole === "CREATOR" && (
                  <Button variant="outline" className="w-full">
                    Edit Contest
                  </Button>
                )}

                {contest.userRole === "VIEWER" &&
                  contest.contestStatus === "NOT_STARTED" && (
                    <Button className="w-full" onClick={handleRegister}>
                      Register for Contest
                    </Button>
                  )}

                {contest.isParticipating &&
                  contest.contestStatus === "RUNNING" && (
                    <Button variant="outline" className="w-full">
                      View Leaderboard
                    </Button>
                  )}
              </CardContent>
            </Card>

            {/* Top Participants */}
            {contest.contestStatus === "RUNNING" &&
              contest.topParticipants &&
              contest.topParticipants.length > 0 && (
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-gray-900">
                      <Award className="h-5 w-5 mr-2" />
                      Top Participants
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {contest.topParticipants.map(
                        (participant: any, _: number) => (
                          <div
                            key={participant.user.username}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="font-semibold text-gray-900 w-6">
                                #{participant.rank}
                              </span>
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={participant.user.avatar}
                                  alt={participant.user.username}
                                />
                                <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                                  {participant.user.firstName || ""}
                                  {participant.user.lastName || ""}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {participant.user.firstName}{" "}
                                  {participant.user.lastName}
                                </p>
                                <p className="text-xs text-gray-600">
                                  @{participant.user.username}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                {participant.score}
                              </p>
                              <p className="text-xs text-gray-600">
                                -{participant.penalty}min
                              </p>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Contest Info */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">
                  Contest Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Start:</span>
                  <span className="text-gray-900">
                    {new Date(contest.startTime).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">End:</span>
                  <span className="text-gray-900">
                    {new Date(contest.endTime).toLocaleString()}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center space-x-2 text-sm">
                  <Target className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Type:</span>
                  <span className="text-gray-900">{contest.type}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Star className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Rated:</span>
                  <span className="text-gray-900">
                    {contest.isRated ? "Yes" : "No"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
