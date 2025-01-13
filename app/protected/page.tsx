import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { DiscordUserProfileCard } from '@/components/discord-user-profile-card'
import { Button } from '@/components/ui/button'
import { Settings, Users, Calendar } from 'lucide-react'

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

  return (
    <div className="container max-w-7xl py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-8 lg:col-start-3">
          <DiscordUserProfileCard profile={profile} />
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-8 lg:col-start-3 flex gap-4">
          <Button className="flex-1" variant="outline">
            <Users className="mr-2 h-4 w-4" />
            Clan Management
          </Button>
          <Button className="flex-1" variant="outline">
            <Users className="mr-2 h-4 w-4" />
            Members
          </Button>
          <Button className="flex-1" variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Events
          </Button>
        </div>
      </div>
    </div>
  )
}
