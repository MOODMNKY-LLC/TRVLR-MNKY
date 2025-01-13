import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { disconnectBungieAccount } from '@/lib/bungie/api'

export async function POST() {
  try {
    // Get the authenticated user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Disconnect the account
    await disconnectBungieAccount(user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error disconnecting Bungie account:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect account' },
      { status: 500 }
    )
  }
} 