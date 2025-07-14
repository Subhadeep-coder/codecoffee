export function Stats() {
    const stats = [
        { label: "Active Users", value: "50K+" },
        { label: "Problems Solved", value: "2M+" },
        { label: "Contest Participants", value: "25K+" },
        { label: "Success Rate", value: "94%" },
    ]

    return (
        <section className="py-16 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
