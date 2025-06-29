import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTA() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Start Your Coding Journey?</h2>
                <p className="text-xl text-muted-foreground mb-8">
                    Join our community of developers and start solving problems today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90">
                        <Link href="/auth">Get Started Free</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="border-border bg-transparent">
                        <Link href="/problems">Browse Problems</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
