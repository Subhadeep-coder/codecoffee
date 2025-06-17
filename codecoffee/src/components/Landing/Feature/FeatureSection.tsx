import { Code, Flame, Trophy, Target, Users, Zap } from "lucide-react"
import { FeatureCard } from "./FeatureCard"

export function FeaturesSection() {
    const features = [
      {
        icon: Code,
        title: "500+ Challenges",
        description: "Access our vast library of coding challenges spanning all difficulty levels, from beginner-friendly to expert-level problems.",
        gradient: "from-blue-500 to-purple-600"
      },
      {
        icon: Flame,
        title: "Daily Streaks",
        description: "Build consistent coding habits with daily challenges. Maintain your streak and watch your skills grow exponentially.",
        gradient: "from-orange-500 to-red-600"
      },
      {
        icon: Trophy,
        title: "Global Leaderboards",
        description: "Compete with developers worldwide. Climb the rankings and showcase your problem-solving prowess.",
        gradient: "from-yellow-500 to-orange-600"
      },
      {
        icon: Target,
        title: "Personalized Learning",
        description: "AI-powered recommendations adapt to your skill level and learning pace for optimized growth.",
        gradient: "from-green-500 to-teal-600"
      },
      {
        icon: Users,
        title: "Community Support",
        description: "Join discussions, share solutions, and learn from a vibrant community of passionate developers.",
        gradient: "from-purple-500 to-pink-600"
      },
      {
        icon: Zap,
        title: "Real-time Feedback",
        description: "Get instant feedback on your solutions with detailed explanations and optimization suggestions.",
        gradient: "from-cyan-500 to-blue-600"
      }
    ]
  
    return (
      <section className="py-24 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Everything you need to become a better programmer, all in one powerful platform
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>
    )
  }