import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { DiscordUserProfileCard } from '@/components/discord-user-profile-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { 
  Settings, 
  Users, 
  Calendar, 
  Activity, 
  Trophy, 
  Shield,
  MessageSquare,
  Bot,
  Boxes,
  Link as LinkIcon,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default async function ProtectedPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/sign-in')
  }

  // Fetch user profile with expanded metadata
  const { data: profile, error: profileError } = await supabase
    .from('discord_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (profileError) {
    console.error('Error fetching Discord profile:', profileError)
  }

  const quickStats = [
    {
      label: 'Clan Members',
      value: '23',
      icon: Users,
      color: 'text-blue-500'
    },
    {
      label: 'Active Events',
      value: '3',
      icon: Calendar,
      color: 'text-green-500'
    },
    {
      label: 'Weekly Activities',
      value: '12',
      icon: Activity,
      color: 'text-purple-500'
    },
    {
      label: 'Achievements',
      value: '47',
      icon: Trophy,
      color: 'text-yellow-500'
    }
  ]

  const integrations = [
    {
      name: 'Discord',
      description: 'Connect your Discord account for server integration and role sync.',
      icon: MessageSquare,
      status: profile ? 'connected' : 'disconnected',
      color: 'text-indigo-500'
    },
    {
      name: 'Bungie.net',
      description: 'Link your Destiny 2 account for inventory and progression tracking.',
      icon: Shield,
      status: 'disconnected', // TODO: Check Bungie.net connection status
      color: 'text-red-500'
    },
    {
      name: 'DIM',
      description: 'Sync with Destiny Item Manager for enhanced loadout management.',
      icon: Boxes,
      status: 'disconnected', // TODO: Check DIM connection status
      color: 'text-blue-500'
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
        <p className="text-muted-foreground">Here's what's happening with your clan</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className={cn(
                  'p-3 rounded-full',
                  'bg-background/10 dark:bg-background/20'
                )}>
                  <Icon className={cn('h-6 w-6', stat.color)} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <h2 className="text-3xl font-bold">{stat.value}</h2>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Integrations Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Connected Accounts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {integrations.map((integration) => {
            const Icon = integration.icon
            const isConnected = integration.status === 'connected'
            
            return (
              <Card key={integration.name} className="relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className={cn('h-5 w-5', integration.color)} />
                    {integration.name}
                    {isConnected ? (
                      <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500 ml-auto" />
                    )}
                  </CardTitle>
                  <CardDescription>{integration.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant={isConnected ? "outline" : "default"}
                    className="w-full"
                  >
                    <LinkIcon className="mr-2 h-4 w-4" />
                    {isConnected ? 'Manage Connection' : 'Connect Account'}
                  </Button>
                </CardContent>
                {isConnected && (
                  <div className="absolute top-0 right-0 p-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>

      {/* Profile Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
        <DiscordUserProfileCard profile={profile} />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <Shield className="h-5 w-5" />
                <span className="font-medium">Manage Clan</span>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <Users className="h-5 w-5" />
                <span className="font-medium">View Members</span>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">Schedule Event</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
