import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { 
  Users, 
  MessagesSquare,
  MessageSquare,
  Rocket,
  Calendar,
  UserPlus,
  Shield
} from "lucide-react"

export default function CommunityPage() {
  const sections = [
    {
      title: "Clan Management",
      description: "Manage your clan members, recruitment, and roles",
      icon: Users,
      items: [
        { icon: Users, label: "Members", href: "/protected/community/clan/members", description: "View and manage clan members" },
        { icon: UserPlus, label: "Recruitment", href: "/protected/community/clan/recruitment", description: "Find new clan members" },
        { icon: Shield, label: "Roles", href: "/protected/community/clan/roles", description: "Configure clan roles" },
      ]
    },
    {
      title: "Social Features",
      description: "Connect with your clan and other guardians",
      icon: MessagesSquare,
      items: [
        { icon: MessageSquare, label: "Chat", href: "/protected/community/chat", description: "Chat with your clan" },
        { icon: Rocket, label: "LFG", href: "/protected/community/lfg", description: "Find a fireteam" },
        { icon: Calendar, label: "Events", href: "/protected/community/events", description: "Plan and join activities" },
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Community Hub</h2>
        <p className="text-sm text-muted-foreground">
          Connect with your clan, find fireteams, and manage your community
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