import { Link, ArrowRight } from "lucide-react"
import { Button } from "../ui/button"

export function CTASection() {
    return (
        <>
      <section className="py-24 bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 relative overflow-hidden">
        {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3csvg width=\"80\" height=\"80\" xmlns=\"http://www.w3.org/2000/svg\"%3e%3cdefs%3e%3cpattern id=\"grid\" width=\"80\" height=\"80\" patternUnits=\"userSpaceOnUse\"%3e%3cpath d=\"m 80 0 l 0 80 l -80 0 z\" fill=\"none\" stroke=\"%23ffffff\" stroke-width=\"0.5\" opacity=\"0.1\"/%3e%3c/pattern%3e%3c/defs%3e%3crect width=\"100%25\" height=\"100%25\" fill=\"url(%23grid)\" /%3e%3c/svg%3e')] opacity-30"></div> */}
        
        <div className="container relative z-10 px-4 md:px-6">
          <div className="text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Level Up Your Skills?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join thousands of developers who are already improving their coding skills every day
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto pt-4">
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-purple-900 hover:bg-slate-100 h-14 text-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                <Link href="/problems">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="h-14 text-lg font-semibold border-white/30 text-white hover:bg-white/10 transition-all duration-300"
              >
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      </>
    )
  }