

interface FeatureCardProps {
    icon: React.ElementType
    title: string
    description: string
    gradient: string
}

export function FeatureCard({ icon: Icon, title, description, gradient }: FeatureCardProps) {

    return (
      <div className="group relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
        <div className="relative bg-white dark:bg-slate-900 rounded-2xl p-8 space-y-6 transition-all duration-300 hover:scale-105">
          <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
    )
  }