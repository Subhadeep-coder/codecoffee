import Link from "next/link"
import { ArrowRight, Code, Flame, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Master Coding Challenges
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Practice with hundreds of coding challenges and improve your skills. Track your progress and compete
                with others.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild size="lg" className="group">
                <Link href="/problems">
                  Start Coding
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4 rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">500+ Challenges</h3>
                <p className="text-muted-foreground">
                  Access a vast library of coding challenges across multiple difficulty levels.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4 rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Flame className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Daily Streaks</h3>
                <p className="text-muted-foreground">
                  Build a habit with daily coding challenges and maintain your streak.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4 rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Leaderboards</h3>
                <p className="text-muted-foreground">Compete with other coders and climb the global leaderboards.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
