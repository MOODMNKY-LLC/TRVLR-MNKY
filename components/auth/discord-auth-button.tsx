'use client'

import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { DiscordLogoIcon } from '@radix-ui/react-icons'
import { useState } from 'react'

export function DiscordAuthButton({ className }: { className?: string }) {
  const [isLoading, setIsLoading] = useState(false)

  async function signInWithDiscord() {
    try {
      setIsLoading(true)
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'identify email guilds guilds.members.read',
          queryParams: {
            prompt: 'consent',
            next: '/protected'
          }
        }
      })

      if (error) {
        console.error('Discord OAuth error:', error)
        throw error
      }
      
      if (data?.url) {
        console.log('Redirecting to Discord OAuth URL:', data.url)
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error signing in with Discord:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      type="button"
      disabled={isLoading}
      onClick={signInWithDiscord}
      className={className}
    >
      {isLoading ? (
        <span className="loading loading-spinner loading-sm"></span>
      ) : (
        <DiscordLogoIcon className="mr-2 h-4 w-4" />
      )}{' '}
      Continue with Discord
    </Button>
  )
} 