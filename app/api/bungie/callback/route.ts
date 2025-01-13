import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { exchangeBungieAuthCode, storeBungieTokens } from '@/lib/bungie/api'

const REDIRECT_BASE = process.env.NEXT_PUBLIC_APP_URL

export async function GET(request: NextRequest) {
  try {
    // Get URL params
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')
    const storedState = request.cookies.get('bungie_auth_state')?.value

    // Validate request
    if (!code) {
      return NextResponse.redirect(new URL('/settings/integrations/bungie?error=invalid_request', REDIRECT_BASE))
    }

    if (!state || !storedState || state !== storedState) {
      return NextResponse.redirect(new URL('/settings/integrations/bungie?error=invalid_state', REDIRECT_BASE))
    }

    // Get authenticated user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('Auth error:', authError)
      return NextResponse.redirect(new URL('/settings/integrations/bungie?error=auth_failed', REDIRECT_BASE))
    }

    // Exchange code for tokens
    const tokens = await exchangeBungieAuthCode(code)

    // Store tokens in database
    await storeBungieTokens({
      userId: user.id,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      membershipId: tokens.membership_id,
      tokenType: tokens.token_type,
      expiresIn: tokens.expires_in
    })

    // Clear state cookie
    const response = NextResponse.redirect(new URL('/settings/integrations/bungie?success=true', REDIRECT_BASE))
    response.cookies.delete('bungie_auth_state')
    return response

  } catch (error) {
    console.error('Error in Bungie callback:', error)
    return NextResponse.redirect(new URL('/settings/integrations/bungie?error=server_error', REDIRECT_BASE))
  }
} 