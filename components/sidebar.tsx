'use client'

import * as React from "react"
import { cn } from "@/lib/utils"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ProfileMenu } from "./profile-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
  Home,
  Users,
  MessageSquare,
  MessagesSquare,
  Calendar,
  UserPlus,
  Shield,
  Sword,
  Target,
  Boxes,
  Brain,
  Database,
  Trophy,
  Wand2,
  Box,
  Medal,
  Star,
  Timer,
  Settings,
  Plug,
  Bot,
  Bell,
  Webhook,
  Sliders,
  Rocket,
  Menu,
  ChevronRight
} from "lucide-react"
import Link from 'next/link'
import Image from 'next/image'

// Type Definitions
interface NavItemBase {
  icon: React.ElementType
  label: string
  description: string
}

interface SimpleNavItem extends NavItemBase {
  href: string
}

interface CollapsibleNavItem extends NavItemBase {
  collapsible: true
  items: SimpleNavItem[]
}

type NavItem = SimpleNavItem | CollapsibleNavItem

interface NavGroup {
  label: string
  href: string
  description: string
  items: NavItem[]
}

interface SidebarProps {
  children?: React.ReactNode
  user?: any
  className?: string
  isCollapsed?: boolean
  onCollapse?: () => void
}

interface SidebarHeaderProps {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

function SidebarHeader({ isCollapsed, setIsCollapsed }: SidebarHeaderProps) {
  return (
    <div className={cn(
      "sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 transition-all duration-300",
      isCollapsed ? "px-2" : "px-4"
    )}>
      <Link href="/" className="flex items-center gap-2 transition-opacity duration-300">
        <div className="relative w-8 h-8">
          <Image
            src="/images/galaxy-ghost.png"
            alt="TRVLR Logo"
            width={32}
            height={32}
            className="rounded-lg transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-foreground/20 to-secondary/20 blur-xl opacity-50" />
        </div>
        {!isCollapsed && (
          <span className="font-semibold bg-gradient-to-r from-primary via-foreground to-secondary bg-clip-text text-transparent transition-opacity duration-300">
            TRVLR
          </span>
        )}
      </Link>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="h-9 w-9 transition-transform duration-300"
      >
        <Menu className={cn(
          "h-4 w-4 transition-transform duration-300",
          isCollapsed ? "rotate-180" : "rotate-0"
        )} />
        <span className="sr-only">Toggle sidebar</span>
      </Button>
    </div>
  )
}

// Navigation Data
const navGroups: NavGroup[] = [
  {
    label: "Overview",
    href: "/protected",
    description: "Dashboard and overview",
    items: [
      { icon: Home, label: "Dashboard", href: "/protected", description: "App overview and status" },
    ]
  },
  {
    label: "Community",
    href: "/protected/community",
    description: "Connect with your clan",
    items: [
      { icon: MessageSquare, label: "Chat", href: "/protected/community/chat", description: "Chat with your clan" },
      { icon: Rocket, label: "LFG", href: "/protected/community/lfg", description: "Find a fireteam" },
      { icon: Calendar, label: "Events", href: "/protected/community/events", description: "Plan and join activities" },
      { 
        icon: Users,
        label: "Clan",
        collapsible: true,
        description: "Manage your clan",
        items: [
          { icon: Users, label: "Members", href: "/protected/community/clan/members", description: "View and manage clan members" },
          { icon: UserPlus, label: "Recruitment", href: "/protected/community/clan/recruitment", description: "Find new clan members" },
          { icon: Shield, label: "Roles", href: "/protected/community/clan/roles", description: "Configure clan roles" },
        ]
      }
    ]
  },
  {
    label: "Fireteam",
    href: "/protected/fireteam",
    description: "Manage your guardians",
    items: [
      {
        icon: Users,
        label: "Guardian",
        collapsible: true,
        description: "Manage your characters",
        items: [
          { icon: Users, label: "Characters", href: "/protected/fireteam/characters", description: "View character stats and equipment" },
          { icon: Boxes, label: "Inventory", href: "/protected/fireteam/inventory", description: "Manage your vault and equipment" },
          { icon: Target, label: "Progress", href: "/protected/fireteam/progress", description: "Track character progress" },
        ]
      },
      {
        icon: Sword,
        label: "Activities",
        collapsible: true,
        description: "Join and track activities",
        items: [
          { icon: Sword, label: "Raids", href: "/protected/fireteam/activities/raids", description: "Join or create raid activities" },
          { icon: Target, label: "Nightfall", href: "/protected/fireteam/activities/nightfall", description: "Find Nightfall groups" },
          { icon: Shield, label: "Trials", href: "/protected/fireteam/activities/trials", description: "Compete in Trials of Osiris" },
        ]
      }
    ]
  },
  {
    label: "Resources",
    href: "/protected/resources",
    description: "Game data and builds",
    items: [
      {
        icon: Brain,
        label: "Theory Crafting",
        description: "Build analysis",
        collapsible: true,
        items: [
          { icon: Wand2, label: "Loadout Builder", href: "/protected/resources/loadout", description: "Create and optimize loadouts" },
          { icon: Box, label: "Vault Analysis", href: "/protected/resources/vault", description: "Analyze your vault contents" },
          { icon: Star, label: "AI Recommendations", href: "/protected/resources/ai", description: "Get AI-powered build suggestions" },
        ]
      },
      {
        icon: Database,
        label: "Database",
        description: "Browse game data",
        collapsible: true,
        items: [
          { icon: Box, label: "Items", href: "/protected/resources/items", description: "Browse weapons, armor, and more" },
          { icon: Calendar, label: "Activities", href: "/protected/resources/activities", description: "View available activities" },
          { icon: Star, label: "Collections", href: "/protected/resources/collections", description: "Track your collections" },
        ]
      },
      {
        icon: Trophy,
        label: "Progress",
        collapsible: true,
        description: "Track achievements",
        items: [
          { icon: Medal, label: "Triumphs", href: "/protected/resources/triumphs", description: "Track your triumphs" },
          { icon: Star, label: "Seasonal", href: "/protected/resources/seasonal", description: "View seasonal progress" },
          { icon: Timer, label: "Weekly Reset", href: "/protected/resources/weekly", description: "Check weekly activities" },
        ]
      }
    ]
  },
  {
    label: "Settings",
    href: "/protected/settings",
    description: "App settings",
    items: [
      {
        icon: Plug,
        label: "Integrations",
        description: "Manage connections",
        collapsible: true,
        items: [
          { icon: MessageSquare, label: "Discord", href: "/protected/settings/integrations/discord", description: "Manage Discord integration" },
          { icon: Rocket, label: "Bungie.net", href: "/protected/settings/integrations/bungie", description: "Configure Bungie.net API access" },
          { icon: Shield, label: "DIM", href: "/protected/settings/integrations/dim", description: "Set up DIM sync" },
        ]
      },
      {
        icon: Bot,
        label: "AI & Automation",
        collapsible: true,
        description: "Configure AI features",
        items: [
          { icon: Bot, label: "AI Settings", href: "/protected/settings/ai", description: "Customize AI behavior" },
          { icon: Webhook, label: "Webhooks", href: "/protected/settings/webhooks", description: "Manage automation webhooks" },
          { icon: Sliders, label: "Preferences", href: "/protected/settings/ai/preferences", description: "Set AI preferences" },
        ]
      },
      {
        icon: Settings,
        label: "App Settings",
        collapsible: true,
        description: "Customize app",
        items: [
          { icon: Bell, label: "Notifications", href: "/protected/settings/notifications", description: "Manage notifications" },
          { icon: Shield, label: "Security", href: "/protected/settings/security", description: "Security settings" },
          { icon: Sliders, label: "Preferences", href: "/protected/settings/preferences", description: "App preferences" },
        ]
      }
    ]
  }
]

export function Sidebar({ user, className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [openGroups, setOpenGroups] = React.useState<string[]>([])

  const toggleGroup = (groupLabel: string) => {
    setOpenGroups(prev => 
      prev.includes(groupLabel) 
        ? prev.filter(g => g !== groupLabel)
        : [...prev, groupLabel]
    )
  }

  const isCollapsibleNavItem = (item: NavItem): item is CollapsibleNavItem => {
    return 'collapsible' in item
  }

  return (
    <nav className={cn(
      "relative flex flex-col h-screen border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300",
      isCollapsed ? "w-[70px]" : "w-[240px]",
      className
    )}>
      <SidebarHeader isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <ScrollArea className="flex-1 py-2">
        <div className="space-y-2 py-2">
          {navGroups.map((group, index) => (
            <div key={group.label} className="space-y-4">
              <div className="px-2">
                <Link 
                  href={group.href}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {group.label}
                </Link>
              </div>
              <div className="pl-1 space-y-1">
                {group.items.map((item) => (
                  isCollapsibleNavItem(item) ? (
                    <CollapsibleNavItem 
                      key={item.label}
                      item={item}
                      isCollapsed={isCollapsed}
                      isOpen={openGroups.includes(item.label)}
                      onToggle={() => toggleGroup(item.label)}
                    />
                  ) : (
                    <NavItem key={item.href} {...item} />
                  )
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className={cn(
        "sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 transition-all duration-300",
        isCollapsed ? "px-2" : "px-4"
      )}>
        <ProfileMenu user={user} isCollapsed={isCollapsed} />
      </div>
    </nav>
  )
}

interface NavItemProps extends SimpleNavItem {
  isCollapsed?: boolean
}

interface CollapsibleNavItemProps {
  item: CollapsibleNavItem
  isCollapsed?: boolean
  isOpen: boolean
  onToggle: () => void
}

function CollapsibleNavItem({ item, isCollapsed, isOpen, onToggle }: CollapsibleNavItemProps) {
  const Icon = item.icon

  if (isCollapsed) {
    return (
      <Button
        variant="ghost"
        className="w-full justify-start px-2 h-10"
        asChild
      >
        <div className="group relative flex items-center">
          <Icon className="h-4 w-4" />
          <div className="absolute left-full ml-2 hidden rounded-md bg-popover px-2 py-1 text-xs group-hover:block shadow-md">
            <p className="font-medium">{item.label}</p>
            {item.items.map((subItem: any) => (
              <p key={subItem.label} className="text-muted-foreground">{subItem.label}</p>
            ))}
          </div>
        </div>
      </Button>
    )
  }

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between px-2 py-1 text-sm hover:bg-accent"
        >
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </div>
          <ChevronRight className={cn(
            "h-4 w-4 transition-transform",
            isOpen && "rotate-90"
          )} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 px-2">
        {item.items.map((subItem: any) => (
          <NavItem
            key={subItem.href}
            icon={subItem.icon}
            label={subItem.label}
            href={subItem.href}
            description={subItem.description}
            isCollapsed={false}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

function NavItem({ icon: Icon, label, href, description, isCollapsed }: NavItemProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start hover:bg-accent",
        isCollapsed ? "h-10 px-2" : "px-2 py-1 text-sm"
      )}
      asChild
    >
      <a href={href} className="group relative flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {!isCollapsed && <span>{label}</span>}
        {isCollapsed && description && (
          <div className="absolute left-full ml-2 hidden rounded-md bg-popover px-2 py-1 text-xs group-hover:block shadow-md">
            <p className="font-medium">{label}</p>
            <p className="text-muted-foreground">{description}</p>
          </div>
        )}
      </a>
    </Button>
  )
} 