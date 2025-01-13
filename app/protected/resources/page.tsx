import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { 
  Brain,
  Database,
  Trophy,
  Wand2,
  Box,
  Medal,
  Calendar,
  Timer,
  Star
} from "lucide-react"

export default function ResourcesPage() {
  const sections = [
    {
      title: "Theory Crafting",
      description: "Analyze and optimize your builds",
      icon: Brain,
      items: [
        { icon: Wand2, label: "Loadout Builder", href: "/protected/resources/loadout", description: "Create and optimize loadouts" },
        { icon: Box, label: "Vault Analysis", href: "/protected/resources/vault", description: "Analyze your vault contents" },
        { icon: Star, label: "AI Recommendations", href: "/protected/resources/ai", description: "Get AI-powered build suggestions" },
      ]
    },
    {
      title: "Destiny Database",
      description: "Browse game items and activities",
      icon: Database,
      items: [
        { icon: Box, label: "Items", href: "/protected/resources/items", description: "Browse weapons, armor, and more" },
        { icon: Calendar, label: "Activities", href: "/protected/resources/activities", description: "View available activities" },
        { icon: Star, label: "Collections", href: "/protected/resources/collections", description: "Track your collections" },
      ]
    },
    {
      title: "Progress Tracking",
      description: "Monitor your achievements and milestones",
      icon: Trophy,
      items: [
        { icon: Medal, label: "Triumphs", href: "/protected/resources/triumphs", description: "Track your triumphs" },
        { icon: Star, label: "Seasonal", href: "/protected/resources/seasonal", description: "View seasonal progress" },
        { icon: Timer, label: "Weekly Reset", href: "/protected/resources/weekly", description: "Check weekly activities" },
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Resources Hub</h2>
        <p className="text-sm text-muted-foreground">
          Explore game data and optimize your builds
        </p>
      </div>
      <Separator className="my-4" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <div key={section.title} className="space-y-4">
            <div className="flex items-center gap-2">
              <section.icon className="h-5 w-5" />
              <h3 className="font-semibold tracking-tight">{section.title}</h3>
            </div>
            <div className="grid gap-2">
              {section.items.map((item) => (
                <Card key={item.href} className="group relative overflow-hidden">
                  <Link href={item.href} className="block p-6">
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <div>
                        <h4 className="font-medium leading-none group-hover:text-primary">
                          {item.label}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                  <span className="absolute inset-0 scale-0 opacity-0 bg-primary/5 transition-all group-hover:scale-100 group-hover:opacity-100" />
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 