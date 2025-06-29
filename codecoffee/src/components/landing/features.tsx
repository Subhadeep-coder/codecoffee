import { CheckCircle, Code2, MessageSquare, BookOpen, Trophy, BarChart3 } from "lucide-react"

export function Features() {
    const features = [
        {
            icon: Code2,
            title: "Interactive Code Editor",
            description: "Write and test your code with our Monaco-powered editor supporting multiple languages.",
        },
        {
            icon: CheckCircle,
            title: "Instant Feedback",
            description: "Get immediate results with detailed test cases and performance metrics.",
        },
        {
            icon: MessageSquare,
            title: "Discussion Forums",
            description: "Engage with the community, share solutions, and learn from others.",
        },
        {
            icon: BookOpen,
            title: "Detailed Solutions",
            description: "Access comprehensive explanations and multiple solution approaches.",
        },
        {
            icon: Trophy,
            title: "Competitive Programming",
            description: "Participate in weekly contests and climb the global leaderboard.",
        },
        {
            icon: BarChart3,
            title: "Progress Tracking",
            description: "Monitor your improvement with detailed analytics and achievement badges.",
        },
    ]

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-foreground mb-4">Everything You Need to Excel</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Our platform provides all the tools and resources you need to become a better programmer.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="p-6 border border-border rounded-lg bg-card">
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                                <feature.icon className="h-6 w-6 text-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
