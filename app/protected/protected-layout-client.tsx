'use client'

import { Sidebar } from '@/components/sidebar'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import * as React from 'react'

export function ProtectedLayoutClient({
  children,
  user,
}: {
  children: React.ReactNode
  user: any // TODO: Add proper type
}) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  return (
    <div className="relative flex min-h-screen">
      <Sidebar user={user} isCollapsed={isCollapsed} className={cn(
        "fixed left-0 top-0 z-20 flex h-screen w-72 -translate-x-72 flex-col border-r bg-background duration-300 ease-in-out",
        "lg:translate-x-0",
        isCollapsed && "lg:w-16"
      )} />
      <main className="flex-1 lg:pl-72">
        <div className="sticky top-0 z-10 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 lg:hidden"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </div>
        {children}
      </main>
    </div>
  )
} 