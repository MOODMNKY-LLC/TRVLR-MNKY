'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Card } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

function CallbackContent() {
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    
    if (code && state) {
      // Handle the auth callback
      fetch(`/api/bungie/callback?code=${code}&state=${state}`)
        .then(response => {
          if (!response.ok) throw new Error('Auth callback failed')
          window.close()
        })
        .catch(error => {
          console.error('Error in auth callback:', error)
          window.close()
        })
    } else {
      console.error('Missing code or state')
      window.close()
    }
  }, [searchParams])

  return (
    <Card className="p-6 flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin" />
      <span className="ml-2">Processing authentication...</span>
    </Card>
  )
}

export default function BungieAuthCallback() {
  return (
    <Suspense fallback={
      <Card className="p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading...</span>
      </Card>
    }>
      <CallbackContent />
    </Suspense>
  )
} 