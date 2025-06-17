import { CTASection } from "@/components/Landing/CTASection";
import { FeaturesSection } from "@/components/Landing/Feature/FeatureSection";
import { HeroSection } from "@/components/Landing/HeroSection";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </div>
  )
}