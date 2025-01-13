import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { DiscordProfileCardServer, DiscordProfileCardFallback } from '@/components/discord-profile-card-server'

export default async function ProfilePage() {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="container max-w-6xl py-8">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      
      <Suspense fallback={<DiscordProfileCardFallback />}>
        <DiscordProfileCardServer userId={user.id} />
      </Suspense>
    </div>
  )
} 