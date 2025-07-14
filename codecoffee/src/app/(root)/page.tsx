import { CTA } from "@/components/landing/cta";
import { Features } from "@/components/landing/features";
import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";

export default function LandingPage() {
    return (
        <>
            <Hero />
            <Stats />
            <Features />
            <CTA />
        </>
    )
}