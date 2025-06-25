import Link from "next/link"
import { Zap, ArrowRight } from "lucide-react"
import { Button } from "../ui/button"

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
            </div>
            
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cdefs%3e%3cpattern id=\'grid\' width=\'60\' height=\'60\' patternUnits=\'userSpaceOnUse\'%3e%3cpath d=\'m 60 0 l 0 60 l -60 0 z\' fill=\'none\' stroke=\'%23ffffff\' stroke-width=\'0.5\' opacity=\'0.1\'/%3e%3c/pattern%3e%3c/defs%3e%3crect width=\'100%25\' height=\'100%25\' fill=\'url(%23grid)\' /%3e%3c/svg%3e')] opacity-20"></div>
            
            <div className="container relative z-10 px-4 md:px-6">
                <div className="flex flex-col items-center space-y-8 text-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-white/90">
                            <Zap className="h-4 w-4 text-yellow-400" />
                            Join 50K+ developers worldwide
                        </div>

                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                            <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                                Master Coding
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                                Challenges
                            </span>
                        </h1>

                        <p className="mx-auto max-w-2xl text-lg md:text-xl text-white/80 leading-relaxed">
                            Elevate your programming skills with our cutting-edge platform. Practice with hundreds of
                            challenges, track your progress, and compete with developers worldwide.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                        <Button
                            asChild
                            size="lg"
                            className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 h-14 text-lg font-semibold shadow-2xl transition-all duration-300 hover:scale-105"
                        >
                            <Link href="/problems">
                                Start Coding
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="h-14 text-lg font-semibold bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                        >
                            <Link href="/dashboard">View Dashboard</Link>
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 pt-8 text-center">
                        <div className="space-y-1">
                            <div className="text-2xl font-bold text-white">500+</div>
                            <div className="text-sm text-white/60">Challenges</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-2xl font-bold text-white">50K+</div>
                            <div className="text-sm text-white/60">Developers</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-2xl font-bold text-white">1M+</div>
                            <div className="text-sm text-white/60">Solutions</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}