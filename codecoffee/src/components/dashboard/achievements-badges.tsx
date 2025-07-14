import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Flame, Target, Award, Zap } from 'lucide-react'

export function AchievementsBadges() {
    const achievements = [
        {
            id: "first-solve",
            title: "First Steps",
            description: "Solved your first problem",
            icon: Star,
            earned: true,
            color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        },
        {
            id: "streak-7",
            title: "Week Warrior",
            description: "7-day solving streak",
            icon: Flame,
            earned: true,
            color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
        },
        {
            id: "easy-50",
            title: "Easy Rider",
            description: "Solved 50 easy problems",
            icon: Target,
            earned: true,
            color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        },
        {
            id: "contest-participant",
            title: "Competitor",
            description: "Participated in a contest",
            icon: Trophy,
            earned: true,
            color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        },
        {
            id: "speed-demon",
            title: "Speed Demon",
            description: "Solved 5 problems in one day",
            icon: Zap,
            earned: false,
            color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
        },
        {
            id: "perfectionist",
            title: "Perfectionist",
            description: "100% acceptance rate (min 10 submissions)",
            icon: Award,
            earned: false,
            color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
        },
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Achievements</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-3">
                    {achievements.map((achievement) => (
                        <div
                            key={achievement.id}
                            className={`p-3 border rounded-lg text-center ${achievement.earned ? "border-border bg-card" : "border-dashed border-muted-foreground/30 opacity-50"
                                }`}
                        >
                            <achievement.icon className={`h-6 w-6 mx-auto mb-2 ${achievement.earned ? "text-foreground" : "text-muted-foreground"}`} />
                            <h4 className={`text-sm font-medium mb-1 ${achievement.earned ? "text-foreground" : "text-muted-foreground"}`}>
                                {achievement.title}
                            </h4>
                            <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
