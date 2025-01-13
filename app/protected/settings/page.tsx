'use client'

import { Card } from "@/components/ui/card"
import { 
  Shield, 
  MessageSquare, 
  Rocket, 
  Bot, 
  Users, 
  Bell, 
  Sliders,
  Webhook,
  Brain,
  Lock,
  Key
} from "lucide-react"
import Link from "next/link"

interface SettingCategory {
  title: string
  description: string
  icon: React.ElementType
  href: string
}

const personalSettings: SettingCategory[] = [
  {
    title: "Account",
    description: "Manage your account settings and profile",
    icon: Shield,
    href: "/protected/settings/account"
  },
  {
    title: "Notifications",
    description: "Configure notification preferences",
    icon: Bell,
    href: "/protected/settings/notifications"
  },
  {
    title: "Appearance",
    description: "Customize app theme and layout",
    icon: Sliders,
    href: "/protected/settings/appearance"
  }
]

const integrationSettings: SettingCategory[] = [
  {
    title: "Discord",
    description: "Configure Discord bot, webhooks, and server sync",
    icon: MessageSquare,
    href: "/protected/settings/integrations/discord"
  },
  {
    title: "Bungie.net",
    description: "Link Destiny 2 account and configure API access",
    icon: Rocket,
    href: "/protected/settings/integrations/bungie"
  },
  {
    title: "DIM",
    description: "Set up DIM sync for inventory management",
    icon: Shield,
    href: "/protected/settings/integrations/dim"
  }
]

const clanSettings: SettingCategory[] = [
  {
    title: "General",
    description: "Basic clan settings and information",
    icon: Users,
    href: "/protected/settings/clan/general"
  },
  {
    title: "Integrations",
    description: "Configure clan-wide Discord bot and webhooks",
    icon: Webhook,
    href: "/protected/settings/clan/integrations"
  },
  {
    title: "Automation",
    description: "Set up clan activity automation and notifications",
    icon: Bot,
    href: "/protected/settings/clan/automation"
  }
]

const aiSettings: SettingCategory[] = [
  {
    title: "AI Preferences",
    description: "Customize AI behavior and responses",
    icon: Brain,
    href: "/protected/settings/ai/preferences"
  },
  {
    title: "Loadout Analysis",
    description: "Configure AI loadout recommendations",
    icon: Bot,
    href: "/protected/settings/ai/loadout"
  },
  {
    title: "Activity Insights",
    description: "Manage AI-powered activity suggestions",
    icon: Brain,
    href: "/protected/settings/ai/insights"
  }
]

const securitySettings: SettingCategory[] = [
  {
    title: "Authentication",
    description: "Configure 2FA and security options",
    icon: Shield,
    href: "/protected/settings/security/auth"
  },
  {
    title: "API Keys",
    description: "Manage API keys and access tokens",
    icon: Key,
    href: "/protected/settings/security/api-keys"
  },
  {
    title: "Permissions",
    description: "Configure app and integration permissions",
    icon: Lock,
    href: "/protected/settings/security/permissions"
  }
]

function SettingSection({ title, categories }: { title: string, categories: SettingCategory[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link key={category.href} href={category.href}>
            <Card className="p-6 hover:bg-accent transition-colors cursor-pointer">
              <div className="flex items-center space-x-4">
                <category.icon className="h-6 w-6" />
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">{category.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <SettingSection title="Personal Settings" categories={personalSettings} />
      <SettingSection title="Integrations" categories={integrationSettings} />
      <SettingSection title="Clan Settings" categories={clanSettings} />
      <SettingSection title="AI Assistant" categories={aiSettings} />
      <SettingSection title="Security" categories={securitySettings} />
    </div>
  )
} 