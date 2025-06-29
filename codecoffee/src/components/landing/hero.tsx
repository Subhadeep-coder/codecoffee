import { Button } from "@/components/ui/button"
import { ArrowRight, Code, Trophy, Users } from "lucide-react"
import Link from "next/link"

export function Hero() {
    return (
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground mb-6">
                        Master Coding
                        <span className="block">One Problem at a Time</span>
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
                        Join thousands of developers improving their coding skills with our comprehensive platform featuring
                        algorithmic challenges, contests, and community-driven learning.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90">
                            <Link href="/problems">
                                Start Solving <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>

                        <Button asChild variant="outline" size="lg" className="border-border bg-transparent">
                            <Link href="/auth">Sign Up Free</Link>
                        </Button>
                    </div>
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                            <Code className="h-6 w-6 text-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">1000+ Problems</h3>
                        <p className="text-muted-foreground">From easy to expert level challenges</p>
                    </div>

                    <div className="text-center">
                        <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                            <Trophy className="h-6 w-6 text-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Weekly Contests</h3>
                        <p className="text-muted-foreground">Compete with developers worldwide</p>
                    </div>

                    <div className="text-center">
                        <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                            <Users className="h-6 w-6 text-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Community</h3>
                        <p className="text-muted-foreground">Learn from others and share knowledge</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
