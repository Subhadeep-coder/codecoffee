import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { Stats } from "@/components/landing/stats"
import { CTA } from "@/components/landing/cta"
import { Navbar } from "@/components/layout/navbar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <CTA />
    </div>
  )
}
