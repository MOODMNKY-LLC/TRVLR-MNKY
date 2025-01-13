'use client'

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  ChevronRight,
  Gamepad,
  Key,
  Lock
} from "lucide-react"
import Link from 'next/link'
import Image from 'next/image'
import { type LucideIcon } from "lucide-react"

// Type Definitions
interface NavItemBase {
  label: string
  icon: LucideIcon
  description?: string
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
  icon: LucideIcon
  href: string
  description: string
  items: NavItem[]
}

interface NavItemProps extends SimpleNavItem {
  isCollapsed: boolean
}

function isCollapsibleNavItem(item: NavItem): item is CollapsibleNavItem {
  return 'collapsible' in item && item.collapsible === true
}

interface SidebarProps {
  user?: any
  className?: string
  isCollapsed?: boolean
}

function SidebarHeader({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <div className={cn(
      "sticky top-0 z-30 flex h-16 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 transition-all duration-300",
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
    </div>
  )
}

// Navigation Data
const navGroups: NavGroup[] = [
  {
    label: "Overview",
    icon: Home,
    href: "/protected",
    description: "Dashboard and overview",
    items: [
      {
        icon: Home,
        label: "Dashboard",
        href: "/protected",
        description: "View your dashboard"
      }
    ]
  },
  {
    label: "Community",
    icon: Users,
    href: "/protected/community",
    description: "Manage community features",
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
    icon: Gamepad,
    href: "/protected/fireteam",
    description: "Manage your fireteam",
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
    icon: Database,
    href: "/protected/resources",
    description: "Access game resources",
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
    icon: Settings,
    href: "/protected/settings",
    description: "Manage app settings",
    items: [
      {
        icon: Plug,
        label: "Personal Settings",
        description: "Manage your account and preferences",
        collapsible: true,
        items: [
          { 
            icon: Shield, 
            label: "Account", 
            href: "/protected/settings/account", 
            description: "Manage your account settings and profile" 
          },
          { 
            icon: Bell, 
            label: "Notifications", 
            href: "/protected/settings/notifications", 
            description: "Configure notification preferences" 
          },
          { 
            icon: Sliders, 
            label: "Appearance", 
            href: "/protected/settings/appearance", 
            description: "Customize app theme and layout" 
          }
        ]
      },
      {
        icon: Plug,
        label: "Integrations",
        description: "Manage external connections",
        collapsible: true,
        items: [
          { 
            icon: MessageSquare, 
            label: "Discord", 
            href: "/protected/settings/integrations/discord", 
            description: "Configure Discord bot, webhooks, and server sync" 
          },
          { 
            icon: Rocket, 
            label: "Bungie.net", 
            href: "/protected/settings/integrations/bungie", 
            description: "Link Destiny 2 account and configure API access" 
          },
          { 
            icon: Shield, 
            label: "DIM", 
            href: "/protected/settings/integrations/dim", 
            description: "Set up DIM sync for inventory management" 
          }
        ]
      },
      {
        icon: Users,
        label: "Clan Settings",
        collapsible: true,
        description: "Manage clan configuration",
        items: [
          { 
            icon: Shield, 
            label: "General", 
            href: "/protected/settings/clan/general", 
            description: "Basic clan settings and information" 
          },
          { 
            icon: Webhook, 
            label: "Integrations", 
            href: "/protected/settings/clan/integrations", 
            description: "Configure clan-wide Discord bot and webhooks" 
          },
          { 
            icon: Bot, 
            label: "Automation", 
            href: "/protected/settings/clan/automation", 
            description: "Set up clan activity automation and notifications" 
          }
        ]
      },
      {
        icon: Bot,
        label: "AI Assistant",
        collapsible: true,
        description: "Configure AI features",
        items: [
          { 
            icon: Brain, 
            label: "Preferences", 
            href: "/protected/settings/ai/preferences", 
            description: "Customize AI behavior and responses" 
          },
          { 
            icon: Wand2, 
            label: "Loadout Analysis", 
            href: "/protected/settings/ai/loadout", 
            description: "Configure AI loadout recommendations" 
          },
          { 
            icon: Star, 
            label: "Activity Insights", 
            href: "/protected/settings/ai/insights", 
            description: "Manage AI-powered activity suggestions" 
          }
        ]
      },
      {
        icon: Shield,
        label: "Security",
        collapsible: true,
        description: "Manage security settings",
        items: [
          { 
            icon: Shield, 
            label: "Authentication", 
            href: "/protected/settings/security/auth", 
            description: "Configure 2FA and security options" 
          },
          { 
            icon: Key, 
            label: "API Keys", 
            href: "/protected/settings/security/api-keys", 
            description: "Manage API keys and access tokens" 
          },
          { 
            icon: Lock, 
            label: "Permissions", 
            href: "/protected/settings/security/permissions", 
            description: "Configure app and integration permissions" 
          }
        ]
      }
    ]
  }
]

function NavGroup({ group, isCollapsed }: { group: NavGroup; isCollapsed: boolean }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="px-2">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center gap-1">
          <Link 
            href={group.href}
            className={cn(
              "flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-colors",
              isOpen && "bg-accent"
            )}
          >
            <group.icon className="h-4 w-4" />
            {!isCollapsed && (
              <span>{group.label}</span>
            )}
          </Link>
          {!isCollapsed && (
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "h-8 w-8 p-0 hover:bg-accent",
                  isOpen && "bg-accent"
                )}
              >
                <ChevronRight 
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isOpen && "rotate-90"
                  )} 
                />
                <span className="sr-only">Toggle {group.label} menu</span>
              </Button>
            </CollapsibleTrigger>
          )}
        </div>
        
        {!isCollapsed && (
          <CollapsibleContent className="space-y-1 px-3 py-2">
            {group.items.map((item) => (
              isCollapsibleNavItem(item) ? (
                <SubNavGroup 
                  key={item.label} 
                  item={item} 
                  isCollapsed={isCollapsed} 
                />
              ) : (
                <NavItem 
                  key={item.href} 
                  {...item} 
                  isCollapsed={isCollapsed} 
                />
              )
            ))}
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  )
}

function SubNavGroup({ item, isCollapsed }: { item: CollapsibleNavItem; isCollapsed: boolean }) {
  const [isOpen, setIsOpen] = React.useState(false)

  if (isCollapsed) {
    return (
      <div className="group relative">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
        >
          <item.icon className="h-4 w-4" />
          <div className="absolute left-full top-0 ml-2 hidden rounded-md bg-popover px-2 py-1 text-sm group-hover:block">
            <p className="font-medium">{item.label}</p>
            {item.items.map((subItem) => (
              <p key={subItem.href} className="text-muted-foreground">{subItem.label}</p>
            ))}
          </div>
        </Button>
      </div>
    )
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-between px-2 py-1 text-sm hover:bg-accent",
            isOpen && "bg-accent"
          )}
        >
          <div className="flex items-center gap-2">
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </div>
          <ChevronRight 
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-90"
            )} 
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 px-2">
        {item.items.map((subItem) => (
          <NavItem
            key={subItem.href}
            {...subItem}
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
      size="sm"
      className={cn(
        "w-full justify-start hover:bg-accent",
        isCollapsed ? "px-2" : "px-2 py-1 text-sm"
      )}
      asChild
    >
      <Link href={href} className="group relative flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {!isCollapsed && <span>{label}</span>}
        {isCollapsed && description && (
          <div className="absolute left-full top-0 ml-2 hidden rounded-md bg-popover px-2 py-1 text-sm group-hover:block">
            <p className="font-medium">{label}</p>
            <p className="text-muted-foreground">{description}</p>
          </div>
        )}
      </Link>
    </Button>
  )
}

export function Sidebar({ user, className, isCollapsed = false }: SidebarProps) {
  return (
    <nav className={cn(
      "relative flex flex-col h-screen border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300",
      isCollapsed ? "w-[70px]" : "w-[240px]",
      className
    )}>
      <SidebarHeader isCollapsed={isCollapsed} />
      
      <ScrollArea className="flex-1 py-2">
        <div className="space-y-2">
          {navGroups.map((group) => (
            <NavGroup 
              key={group.label} 
              group={group} 
              isCollapsed={isCollapsed} 
            />
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