import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { 
  Settings,
  Plug,
  Bot,
  Bell,
  Shield,
  Webhook,
  MessageSquare,
  Rocket,
  Sliders
} from "lucide-react"

export default function SettingsPage() {
  const sections = [
    {
      title: "Integrations",
      description: "Manage connected services and APIs",
      icon: Plug,
      items: [
        { icon: MessageSquare, label: "Discord", href: "/protected/settings/integrations/discord", description: "Manage Discord integration" },
        { icon: Rocket, label: "Bungie.net", href: "/protected/settings/integrations/bungie", description: "Configure Bungie.net API access" },
        { icon: Shield, label: "DIM", href: "/protected/settings/integrations/dim", description: "Set up DIM sync" },
      ]
    },
    {
      title: "AI & Automation",
      description: "Configure AI features and automation",
      icon: Bot,
      items: [
        { icon: Bot, label: "AI Settings", href: "/protected/settings/ai", description: "Customize AI behavior" },
        { icon: Webhook, label: "Webhooks", href: "/protected/settings/webhooks", description: "Manage automation webhooks" },
        { icon: Sliders, label: "Preferences", href: "/protected/settings/ai/preferences", description: "Set AI preferences" },
      ]
    },
    {
      title: "App Settings",
      description: "Customize your app experience",
      icon: Settings,
      items: [
        { icon: Bell, label: "Notifications", href: "/protected/settings/notifications", description: "Manage notifications" },
        { icon: Shield, label: "Security", href: "/protected/settings/security", description: "Security settings" },
        { icon: Sliders, label: "Preferences", href: "/protected/settings/preferences", description: "App preferences" },
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Settings Hub</h2>
        <p className="text-sm text-muted-foreground">
          Manage your app settings and integrations
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