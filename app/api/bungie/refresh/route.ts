import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { refreshBungieTokens, storeBungieTokens } from '@/lib/bungie/api'

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

    // Get current refresh token
    const { data: bungieAccount, error: fetchError } = await supabase
      .from('bungie_accounts')
      .select('refresh_token')
      .eq('user_id', user.id)
      .single()

    if (fetchError || !bungieAccount) {
      return NextResponse.json(
        { error: 'No Bungie account found' },
        { status: 404 }
      )
    }

    // Refresh the tokens
    const tokenData = await refreshBungieTokens(bungieAccount.refresh_token)

    // Store new tokens
    await storeBungieTokens({
      userId: user.id,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      membershipId: tokenData.membership_id,
      tokenType: tokenData.token_type,
      expiresIn: tokenData.expires_in
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error refreshing Bungie tokens:', error)
    return NextResponse.json(
      { error: 'Failed to refresh tokens' },
      { status: 500 }
    )
  }
} 