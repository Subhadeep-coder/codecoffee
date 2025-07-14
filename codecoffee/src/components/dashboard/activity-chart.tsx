"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ActivityChart() {
    // Mock activity data - replace with real data
    const generateActivityData = () => {
        const data = []
        const today = new Date()

        for (let i = 364; i >= 0; i--) {
            const date = new Date(today)
            date.setDate(date.getDate() - i)

            const activity = Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0
            data.push({
                date: date.toISOString().split('T')[0],
                count: activity,
            })
        }

        return data
    }

    const activityData = generateActivityData()
    const weeks = []

    // Group data by weeks
    for (let i = 0; i < activityData.length; i += 7) {
        weeks.push(activityData.slice(i, i + 7))
    }

    const getActivityColor = (count: number) => {
        if (count === 0) return "bg-muted"
        if (count === 1) return "bg-green-200 dark:bg-green-900"
        if (count === 2) return "bg-green-300 dark:bg-green-800"
        if (count === 3) return "bg-green-400 dark:bg-green-700"
        if (count === 4) return "bg-green-500 dark:bg-green-600"
        return "bg-green-600 dark:bg-green-500"
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Activity</CardTitle>
                <p className="text-sm text-muted-foreground">Your coding activity over the past year</p>
            </CardHeader>
            <CardContent>
                <div className="flex gap-1 overflow-x-auto pb-4">
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                            {week.map((day, dayIndex) => (
                                <div
                                    key={dayIndex}
                                    className={`w-3 h-3 rounded-sm ${getActivityColor(day.count)}`}
                                    title={`${day.date}: ${day.count} submissions`}
                                />
                            ))}
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                    <span>Less</span>
                    <div className="flex gap-1">
                        {[0, 1, 2, 3, 4, 5].map((level) => (
                            <div key={level} className={`w-3 h-3 rounded-sm ${getActivityColor(level)}`} />
                        ))}
                    </div>
                    <span>More</span>
                </div>
            </CardContent>
        </Card>
    )
}
