import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { 
  Users,
  Sword,
  Target,
  Shield,
  Boxes
} from "lucide-react"

export default function FireteamPage() {
  const sections = [
    {
      title: "Guardian Management",
      description: "Manage your characters, inventory, and progress",
      icon: Users,
      items: [
        { icon: Users, label: "Characters", href: "/protected/fireteam/characters", description: "View character stats and equipment" },
        { icon: Boxes, label: "Inventory", href: "/protected/fireteam/inventory", description: "Manage your vault and equipment" },
        { icon: Target, label: "Progress", href: "/protected/fireteam/progress", description: "Track character progress" },
      ]
    },
    {
      title: "Activities",
      description: "Join and track various Destiny 2 activities",
      icon: Sword,
      items: [
        { icon: Sword, label: "Raids", href: "/protected/fireteam/activities/raids", description: "Join or create raid activities" },
        { icon: Target, label: "Nightfall", href: "/protected/fireteam/activities/nightfall", description: "Find Nightfall groups" },
        { icon: Shield, label: "Trials", href: "/protected/fireteam/activities/trials", description: "Compete in Trials of Osiris" },
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Fireteam Hub</h2>
        <p className="text-sm text-muted-foreground">
          Manage your guardians and join activities
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