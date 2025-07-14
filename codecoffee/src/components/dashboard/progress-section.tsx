import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ProgressSectionProps {
    stats: {
        easySolved: number
        mediumSolved: number
        hardSolved: number
    }
}

export function ProgressSection({ stats }: ProgressSectionProps) {
    const progressData = [
        {
            difficulty: "Easy",
            solved: stats.easySolved,
            total: 200,
            color: "bg-green-500",
        },
        {
            difficulty: "Medium",
            solved: stats.mediumSolved,
            total: 150,
            color: "bg-yellow-500",
        },
        {
            difficulty: "Hard",
            solved: stats.hardSolved,
            total: 100,
            color: "bg-red-500",
        },
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {progressData.map((item) => (
                    <div key={item.difficulty}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-foreground">{item.difficulty}</span>
                            <span className="text-sm text-muted-foreground">
                                {item.solved}/{item.total}
                            </span>
                        </div>
                        <Progress value={(item.solved / item.total) * 100} className="h-2" />
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
