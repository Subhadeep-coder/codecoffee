"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Activity, Trophy, Flame } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface UserStats {
  solved: number
  totalProblems: number
  easyCount: number
  mediumCount: number
  hardCount: number
  streak: number
  ranking: number
  submissions: {
    id: string
    problemId: string
    problemTitle: string
    status: "Accepted" | "Wrong Answer" | "Time Limit Exceeded" | "Runtime Error"
    language: string
    timestamp: string
  }[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true)
        // In a real app, this would be an API call
        // const response = await axios.get("/api/user/stats")
        // const data = response.data

        // Mock data for demonstration
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockStats: UserStats = {
          solved: 42,
          totalProblems: 1500,
          easyCount: 25,
          mediumCount: 15,
          hardCount: 2,
          streak: 7,
          ranking: 5432,
          submissions: [
            {
              id: "sub1",
              problemId: "1",
              problemTitle: "Two Sum",
              status: "Accepted",
              language: "JavaScript",
              timestamp: "2023-06-15T14:30:00Z",
            },
            {
              id: "sub2",
              problemId: "2",
              problemTitle: "Add Two Numbers",
              status: "Wrong Answer",
              language: "Python",
              timestamp: "2023-06-14T10:15:00Z",
            },
            {
              id: "sub3",
              problemId: "3",
              problemTitle: "Longest Substring Without Repeating Characters",
              status: "Accepted",
              language: "TypeScript",
              timestamp: "2023-06-13T18:45:00Z",
            },
            {
              id: "sub4",
              problemId: "4",
              problemTitle: "Median of Two Sorted Arrays",
              status: "Time Limit Exceeded",
              language: "Java",
              timestamp: "2023-06-12T09:20:00Z",
            },
            {
              id: "sub5",
              problemId: "5",
              problemTitle: "Longest Palindromic Substring",
              status: "Accepted",
              language: "C++",
              timestamp: "2023-06-11T16:10:00Z",
            },
          ],
        }

        setStats(mockStats)
      } catch (error) {
        console.error("Error fetching user stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserStats()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const statusColor = {
    Accepted: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
    "Wrong Answer": "bg-red-500/10 text-red-500 hover:bg-red-500/20",
    "Time Limit Exceeded": "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
    "Runtime Error": "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="space-y-8">
          <Skeleton className="h-8 w-1/4" />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
          </div>

          <Skeleton className="h-[400px]" />
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold">Failed to load dashboard</h1>
          <p className="text-muted-foreground mt-2">
            There was an error loading your statistics. Please try again later.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Problems Solved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.solved} / {stats.totalProblems}
              </div>
              <Progress value={(stats.solved / stats.totalProblems) * 100} className="h-2 mt-2" />
              <div className="grid grid-cols-3 gap-1 mt-4">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-muted-foreground">Easy</span>
                  <span className="font-medium text-green-500">{stats.easyCount}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-muted-foreground">Medium</span>
                  <span className="font-medium text-yellow-500">{stats.mediumCount}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-muted-foreground">Hard</span>
                  <span className="font-medium text-red-500">{stats.hardCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Flame className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.streak} days</div>
                <p className="text-xs text-muted-foreground">Keep it going!</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Global Ranking</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">#{stats.ranking}</div>
                <p className="text-xs text-muted-foreground">Top 5%</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Activity</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {stats.submissions.length}
                  <span className="text-sm font-normal text-muted-foreground ml-1">this week</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.submissions.filter((s) => s.status === "Accepted").length} accepted
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>Your most recent problem submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="accepted">Accepted</TabsTrigger>
                <TabsTrigger value="wrong">Wrong Answer</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Problem</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Language</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.submissions.map((submission) => (
                          <tr key={submission.id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 align-middle">
                              <Badge variant="outline" className={statusColor[submission.status]}>
                                {submission.status}
                              </Badge>
                            </td>
                            <td className="p-4 align-middle">
                              <Link href={`/problems/${submission.problemId}`} className="font-medium hover:underline">
                                {submission.problemTitle}
                              </Link>
                            </td>
                            <td className="p-4 align-middle">
                              <Badge variant="secondary">{submission.language}</Badge>
                            </td>
                            <td className="p-4 align-middle text-muted-foreground">
                              {formatDate(submission.timestamp)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="accepted" className="mt-4">
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <th className="h-12 px-4 text-left align-middle font-medium">Problem</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Language</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.submissions
                          .filter((s) => s.status === "Accepted")
                          .map((submission) => (
                            <tr key={submission.id} className="border-b transition-colors hover:bg-muted/50">
                              <td className="p-4 align-middle">
                                <Link
                                  href={`/problems/${submission.problemId}`}
                                  className="font-medium hover:underline"
                                >
                                  {submission.problemTitle}
                                </Link>
                              </td>
                              <td className="p-4 align-middle">
                                <Badge variant="secondary">{submission.language}</Badge>
                              </td>
                              <td className="p-4 align-middle text-muted-foreground">
                                {formatDate(submission.timestamp)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="wrong" className="mt-4">
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Problem</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Language</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.submissions
                          .filter((s) => s.status !== "Accepted")
                          .map((submission) => (
                            <tr key={submission.id} className="border-b transition-colors hover:bg-muted/50">
                              <td className="p-4 align-middle">
                                <Badge variant="outline" className={statusColor[submission.status]}>
                                  {submission.status}
                                </Badge>
                              </td>
                              <td className="p-4 align-middle">
                                <Link
                                  href={`/problems/${submission.problemId}`}
                                  className="font-medium hover:underline"
                                >
                                  {submission.problemTitle}
                                </Link>
                              </td>
                              <td className="p-4 align-middle">
                                <Badge variant="secondary">{submission.language}</Badge>
                              </td>
                              <td className="p-4 align-middle text-muted-foreground">
                                {formatDate(submission.timestamp)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
