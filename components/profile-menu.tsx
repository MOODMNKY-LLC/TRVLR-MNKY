'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  LogOut,
  User,
  Settings,
  Shield,
  ExternalLink,
  Palette
} from 'lucide-react'
import { signOutAction } from '@/app/actions'
import AvatarCircles from './ui/avatar-circles'
import { ThemeSwitcher } from '@/components/theme-switcher'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Separator } from './ui/separator'

interface ProfileMenuProps {
  user?: {
    id: string
    email?: string
    avatar_url?: string
    username?: string
    global_name?: string
  }
  className?: string
  isCollapsed?: boolean
}

export function ProfileMenu({ user, className, isCollapsed }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Default values if user is undefined
  const displayName = user?.global_name || user?.username || user?.email || 'Guest'
  const avatarUrl = user?.avatar_url || 'https://github.com/shadcn.png'

  const menuItems = [
    {
      label: 'View Profile',
      icon: User,
      href: '/protected/profile',
      description: 'View and edit your profile settings'
    },
    {
      label: 'Clan Settings',
      icon: Shield,
      href: '/protected/clan/settings',
      description: 'Manage your clan preferences'
    },
    {
      label: 'App Settings',
      icon: Settings,
      href: '/protected/settings',
      description: 'Configure app appearance and notifications'
    },
    {
      label: 'Discord Profile',
      icon: ExternalLink,
      href: 'https://discord.com/users/me',
      external: true,
      description: 'View your Discord profile'
    }
  ]

  // If no user, show a simplified version
  if (!user) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "flex items-center gap-2 px-2 hover:bg-accent",
          isCollapsed ? "w-8 p-0" : "w-full justify-start"
        )}
      >
        <AvatarCircles
          avatarUrls={[{ imageUrl: avatarUrl, profileUrl: '#' }]}
          className={cn(
            "h-8 w-8 shrink-0",
            !isCollapsed && "mr-2"
          )}
        />
        {!isCollapsed && (
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-medium leading-none">Guest</span>
            <span className="text-xs text-muted-foreground">Sign in</span>
          </div>
        )}
      </Button>
    )
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center gap-2 px-2 hover:bg-accent",
          isCollapsed ? "w-8 p-0" : "w-full justify-start"
        )}
      >
        <AvatarCircles
          avatarUrls={[{ imageUrl: avatarUrl, profileUrl: '#' }]}
          className={cn(
            "h-8 w-8 shrink-0",
            !isCollapsed && "mr-2"
          )}
        />
        {!isCollapsed && (
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-medium leading-none">{displayName}</span>
            <span className="text-xs text-muted-foreground">View profile</span>
          </div>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center gap-4 pb-4 border-b">
              <AvatarCircles 
                avatarUrls={[{ imageUrl: avatarUrl, profileUrl: '#' }]}
                className="h-16 w-16"
              />
              <div className="flex flex-col">
                <span className="text-lg font-semibold">{displayName}</span>
                <span className="text-sm text-muted-foreground">{user.email}</span>
              </div>
            </div>
            <div className="space-y-2">
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={item.href} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {item.description && (
                      <span className="text-xs text-muted-foreground ml-auto">
                        {item.description}
                      </span>
                    )}
                  </Link>
                </Button>
              ))}
              <Separator className="my-2" />
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <span>Theme</span>
                </div>
                <ThemeSwitcher />
              </div>
              <Separator className="my-2" />
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => signOutAction()}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 