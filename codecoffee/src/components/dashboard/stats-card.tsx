import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Target, TrendingUp, Flame } from "lucide-react"

interface StatsCardsProps {
    stats: {
        totalSolved: number
        easySolved: number
        mediumSolved: number
        hardSolved: number
        totalSubmissions: number
        acceptanceRate: number
        maxStreak: number
        currentStreak: number
    }
}

export function StatsCards({ stats }: StatsCardsProps) {
    const cards = [
        {
            title: "Problems Solved",
            value: stats.totalSolved,
            icon: CheckCircle,
            description: `${stats.totalSubmissions} total submissions`,
            color: "text-green-600",
        },
        {
            title: "Acceptance Rate",
            value: `${stats.acceptanceRate}%`,
            icon: Target,
            description: "Success rate",
            color: "text-blue-600",
        },
        {
            title: "Max Streak",
            value: stats.maxStreak,
            icon: TrendingUp,
            description: "days in a row",
            color: "text-purple-600",
        },
        {
            title: "Current Streak",
            value: stats.currentStreak,
            icon: Flame,
            description: "days active",
            color: "text-orange-600",
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                        <card.icon className={`h-4 w-4 ${card.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{card.value}</div>
                        <p className="text-xs text-muted-foreground">{card.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
