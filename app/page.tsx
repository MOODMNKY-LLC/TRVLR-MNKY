import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Shield, 
  Bot,
  ArrowRight,
  MessageSquare,
  Boxes,
  Sword
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden py-20 md:py-32">
        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background">
          <div className="relative aspect-square w-full max-w-3xl">
            <div className="absolute inset-0 translate-x-1/2 translate-y-1/2 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl" />
            <div className="absolute inset-0 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-secondary/20 to-primary/20 blur-3xl" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 container px-4 space-y-8">
          {/* App Logo/Icon */}
          <div className="mx-auto relative animate-float">
            <div className="absolute inset-0 blur-2xl opacity-50 bg-primary/20 scale-150" />
            <div className="absolute inset-0 blur-3xl opacity-30 bg-secondary/20 scale-125" />
            <Image
              src="/images/galaxy-ghost.png"
              alt="TRVLR Logo"
              width={180}
              height={180}
              className="relative z-10 drop-shadow-2xl"
              priority
            />
            <div className="absolute inset-0 animate-pulse">
              <div className="absolute inset-0 blur-2xl opacity-30 bg-primary/30 scale-110" />
            </div>
          </div>

          {/* Hero Text */}
          <div className="text-center space-y-4 mt-16">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in">
              <span className="relative inline-block bg-gradient-to-br from-primary via-foreground to-secondary bg-clip-text text-transparent">
                <span className="absolute inset-0 blur-2xl opacity-50 bg-gradient-to-br from-primary via-foreground to-secondary" aria-hidden="true">
                  TRVLR
                </span>
                TRVLR
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl animate-fade-in-up">
              A Ghost-powered command center that seamlessly connects your Discord community with Destiny 2. Harness the power of AI for loadout optimization, inventory management, and clan coordination.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in">
            <Button size="lg" className="glass-hover cosmic-shadow" asChild>
              <Link href="/sign-in">
                Begin Your Legend <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="glass-hover" asChild>
              <Link href="https://discord.gg/your-invite" target="_blank">
                <MessageSquare className="mr-2 h-4 w-4" /> Join the Vanguard
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative border-t bg-background/50 backdrop-blur-sm py-20">
        <div className="container px-4 space-y-16">
          <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl">
            Tools of the Light
          </h2>
          
          <div className="grid gap-8 md:grid-cols-2">
            {/* Discord Integration */}
            <div className="group relative space-y-4 rounded-lg border p-6 glass-hover cosmic-shadow">
              <MessageSquare className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-bold">Tower Communications</h3>
              <p className="text-muted-foreground">
                Elevate your clan's Discord experience with deep server integration. Automatically sync roles, manage permissions, and coordinate activities through our advanced bot commands.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>• OAuth2-powered role synchronization</li>
                <li>• Real-time activity webhooks</li>
                <li>• Rich presence integration</li>
              </ul>
            </div>

            {/* AI Integration */}
            <div className="group relative space-y-4 rounded-lg border p-6 glass-hover cosmic-shadow">
              <Bot className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-bold">Ghost Intelligence</h3>
              <p className="text-muted-foreground">
                Your AI-powered Ghost companion analyzes your gameplay data through the Bungie API, providing tactical insights and loadout recommendations based on your actual performance.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>• Performance-based loadout analysis</li>
                <li>• Activity-specific strategies</li>
                <li>• Real-time combat assistance</li>
              </ul>
            </div>

            {/* Bungie.net Integration */}
            <div className="group relative space-y-4 rounded-lg border p-6 glass-hover cosmic-shadow">
              <Shield className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-bold">Vanguard Network</h3>
              <p className="text-muted-foreground">
                Full OAuth2 integration with Bungie.net gives you comprehensive control over your Guardian's journey, from inventory management to detailed activity tracking.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>• Complete inventory access</li>
                <li>• Detailed progression tracking</li>
                <li>• Advanced clan management</li>
              </ul>
            </div>

            {/* DIM Integration */}
            <div className="group relative space-y-4 rounded-lg border p-6 glass-hover cosmic-shadow">
              <Boxes className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-bold">Arsenal Mastery</h3>
              <p className="text-muted-foreground">
                Seamless integration with DIM-sync API lets you manage loadouts across platforms while adding AI-powered optimization to your existing DIM workflow.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>• Cross-platform loadout sync</li>
                <li>• AI-enhanced build crafting</li>
                <li>• Instant inventory transfers</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative border-t bg-background/50 backdrop-blur-sm py-16">
        <div className="container px-4 text-center space-y-8">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Ready to Become Legend?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Join the ranks of Guardians who have enhanced their journey through seamless integration of Discord, Bungie.net, and DIM—all powered by advanced AI.
          </p>
          <Button size="lg" className="glass-hover cosmic-shadow" asChild>
            <Link href="/sign-in">
              Answer the Call <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/50 backdrop-blur-sm py-6 mt-auto">
        <div className="container px-4">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2024 TRVLR. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
                <Link href="/privacy">Privacy</Link>
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
                <Link href="/terms">Terms</Link>
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
                <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer">
                  <Shield className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
