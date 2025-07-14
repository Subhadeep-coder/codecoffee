import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Trophy, Edit } from 'lucide-react'

interface ProfileHeaderProps {
    user: {
        username: string
        email: string
        avatar: string
        joinDate: string
        rank: number
        contestRating: number
        globalRanking: number
    }
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
    const getRankBadge = (rating: number) => {
        if (rating >= 2000) return { label: "Expert", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" }
        if (rating >= 1600) return { label: "Specialist", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" }
        if (rating >= 1200) return { label: "Pupil", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" }
        return { label: "Newbie", color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300" }
    }

    const rankBadge = getRankBadge(user.contestRating)

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                        <AvatarFallback className="text-2xl">{user.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-foreground mb-1">{user.username}</h1>
                                <p className="text-muted-foreground">{user.email}</p>
                            </div>
                            <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Profile
                            </Button>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Joined {user.joinDate}
                            </div>
                            <div className="flex items-center gap-1">
                                <Trophy className="h-4 w-4" />
                                Rank #{user.rank}
                            </div>
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                Global Ranking #{user.globalRanking.toLocaleString()}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Badge className={rankBadge.color}>{rankBadge.label}</Badge>
                            <Badge variant="outline">Contest Rating: {user.contestRating}</Badge>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
