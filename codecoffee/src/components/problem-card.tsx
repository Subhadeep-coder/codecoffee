import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Difficulty = "Easy" | "Medium" | "Hard"

interface ProblemCardProps {
  id: string
  title: string
  difficulty: Difficulty
  tags: string[]
  solvedCount: number
  className?: string
}

export function ProblemCard({ id, title, difficulty, tags, solvedCount, className }: ProblemCardProps) {
  const difficultyColor = {
    Easy: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
    Medium: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
    Hard: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  }

  return (
    <Link href={`/problems/${id}`}>
      <Card className={cn("transition-all hover:shadow-md hover:border-primary/50", className)}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold line-clamp-1">{title}</CardTitle>
            <Badge variant="outline" className={difficultyColor[difficulty]}>
              {difficulty}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">{solvedCount.toLocaleString()} users solved</CardFooter>
      </Card>
    </Link>
  )
}
