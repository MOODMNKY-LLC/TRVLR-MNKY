import { createClient } from '@/utils/supabase/server'
import { DiscordUserProfileCard } from './discord-user-profile-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { type DiscordProfile, type DiscordUserRole } from '@/types/discord'

interface DiscordProfileCardServerProps {
  userId: string
}

function DiscordProfileCardSkeleton() {
  return (
    <div className="w-full max-w-2xl space-y-4">
      {/* Banner Skeleton */}
      <Skeleton className="w-full h-24" />
      
      {/* Avatar Skeleton */}
      <div className="relative px-6">
        <div className="absolute -top-12">
          <Skeleton className="w-20 h-20 rounded-full" />
        </div>
      </div>
      
      {/* Content Skeleton */}
      <div className="pt-12 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
        <div className="space-y-3 pt-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-2/3" />
        </div>
      </div>
    </div>
  )
}

function ErrorDisplay({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {message}
      </AlertDescription>
    </Alert>
  )
}

export async function DiscordProfileCardServer({ userId }: DiscordProfileCardServerProps) {
  const supabase = await createClient()

  try {
    // First verify the user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      return <ErrorDisplay message="Authentication error. Please try logging in again." />
    }

    if (!user) {
      return <ErrorDisplay message="You must be logged in to view this profile." />
    }

    // Only allow users to view their own profile or admins to view any profile
    if (user.id !== userId) {
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single() as { data: DiscordUserRole | null }

      if (!userRoles?.role?.includes('admin')) {
        return <ErrorDisplay message="You don't have permission to view this profile." />
      }
    }

    // Fetch the Discord profile
    const { data: profile, error: profileError } = await supabase
      .from('discord_profiles')
      .select('*')
      .eq('user_id', userId)
      .single() as { data: DiscordProfile | null, error: any }

    if (profileError) {
      throw profileError
    }

    if (!profile) {
      return <ErrorDisplay message="Discord profile not found. Have you connected your Discord account?" />
    }

    return <DiscordUserProfileCard profile={profile} />

  } catch (error) {
    console.error('Error fetching Discord profile:', error)
    return (
      <ErrorDisplay 
        message="Failed to load Discord profile. Please try again later."
      />
    )
  }
}

// Loading state for Suspense
export function DiscordProfileCardFallback() {
  return <DiscordProfileCardSkeleton />
} 