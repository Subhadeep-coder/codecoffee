import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import Link from "next/link"

export function RecentSubmissions() {
    const submissions = [
        {
            id: "1",
            problemTitle: "Two Sum",
            problemId: "1",
            status: "Accepted",
            language: "JavaScript",
            runtime: "64 ms",
            memory: "15.2 MB",
            timestamp: "2 hours ago",
        },
        {
            id: "2",
            problemTitle: "Add Two Numbers",
            problemId: "2",
            status: "Wrong Answer",
            language: "Python",
            runtime: "-",
            memory: "-",
            timestamp: "5 hours ago",
        },
        {
            id: "3",
            problemTitle: "Longest Substring",
            problemId: "3",
            status: "Time Limit Exceeded",
            language: "Java",
            runtime: "-",
            memory: "-",
            timestamp: "1 day ago",
        },
        {
            id: "4",
            problemTitle: "Median of Two Sorted Arrays",
            problemId: "4",
            status: "Accepted",
            language: "C++",
            runtime: "12 ms",
            memory: "8.1 MB",
            timestamp: "2 days ago",
        },
    ]

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Accepted":
                return <CheckCircle className="h-4 w-4 text-green-600" />
            case "Wrong Answer":
                return <XCircle className="h-4 w-4 text-red-600" />
            case "Time Limit Exceeded":
                return <Clock className="h-4 w-4 text-yellow-600" />
            default:
                return <XCircle className="h-4 w-4 text-red-600" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Accepted":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            case "Wrong Answer":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
            case "Time Limit Exceeded":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
            default:
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Recent Submissions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {submissions.map((submission) => (
                        <div key={submission.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                            <div className="flex items-center gap-3">
                                {getStatusIcon(submission.status)}
                                <div>
                                    <Link
                                        href={`/problems/${submission.problemId}`}
                                        className="font-medium text-foreground hover:text-foreground/80"
                                    >
                                        {submission.problemTitle}
                                    </Link>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge className={getStatusColor(submission.status)}>{submission.status}</Badge>
                                        <span className="text-xs text-muted-foreground">{submission.language}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right text-sm text-muted-foreground">
                                {submission.status === "Accepted" && (
                                    <div>
                                        <div>{submission.runtime}</div>
                                        <div>{submission.memory}</div>
                                    </div>
                                )}
                                <div className="mt-1">{submission.timestamp}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
