import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { createServerClient } from '@supabase/ssr'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
    redirect('/login')
  }

  // Fetch user's Discord profile
  const { data: profile, error: profileError } = await supabase
    .from('discord_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (profileError) {
    console.error('Error fetching Discord profile:', profileError)
  }

  // Combine user data with Discord profile
  const userData = {
    ...user,
    ...profile
  }

  return (
    <div className="flex h-screen">
      <Sidebar user={userData} />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
} 