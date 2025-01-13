import axios from 'axios'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const BUNGIE_API_ROOT = process.env.NEXT_PUBLIC_BUNGIE_BASE_URL
const BUNGIE_API_KEY = process.env.BUNGIE_API_KEY
const BUNGIE_CLIENT_ID = process.env.BUNGIE_CLIENT_ID
const BUNGIE_CLIENT_SECRET = process.env.BUNGIE_CLIENT_SECRET
const BUNGIE_REDIRECT_URI = process.env.NEXT_PUBLIC_BUNGIE_REDIRECT_URI

export const bungieApi = axios.create({
  baseURL: BUNGIE_API_ROOT,
  headers: {
    'X-API-Key': BUNGIE_API_KEY
  }
})

export async function exchangeBungieAuthCode(code: string) {
  try {
    const tokenResponse = await axios.post(
      'https://www.bungie.net/platform/app/oauth/token/',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: BUNGIE_CLIENT_ID!,
        client_secret: BUNGIE_CLIENT_SECRET!,
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-API-Key': BUNGIE_API_KEY!
        }
      }
    )

    return tokenResponse.data
  } catch (error) {
    console.error('Error exchanging Bungie auth code:', error)
    throw error
  }
}

async function getBungieProfile(accessToken: string, membershipId: string) {
  try {
    const response = await axios.get(
      `${BUNGIE_API_ROOT}/User/GetMembershipsById/${membershipId}/-1/`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-API-Key': BUNGIE_API_KEY!
        }
      }
    )

    const { bungieNetUser } = response.data.Response
    return {
      displayName: bungieNetUser.displayName,
      membershipId: bungieNetUser.membershipId,
      membershipType: bungieNetUser.membershipType
    }
  } catch (error) {
    console.error('Error fetching Bungie profile:', error)
    return null
  }
}

export async function storeBungieTokens({
  userId,
  accessToken,
  refreshToken,
  membershipId,
  tokenType,
  expiresIn
}: {
  userId: string
  accessToken: string
  refreshToken: string
  membershipId: string
  tokenType: string
  expiresIn: number
}) {
  const supabase = await createClient()
  const expiresAt = new Date(Date.now() + expiresIn * 1000)

  // Fetch Bungie profile
  const profile = await getBungieProfile(accessToken, membershipId)

  const { error } = await supabase
    .from('bungie_accounts')
    .upsert({
      user_id: userId,
      access_token: accessToken,
      refresh_token: refreshToken,
      membership_id: membershipId,
      token_type: tokenType,
      expires_at: expiresAt.toISOString(),
      bungie_profile: profile
    }, {
      onConflict: 'user_id'
    })

  if (error) {
    console.error('Error storing Bungie tokens:', error)
    throw error
  }
}

export async function getBungieAuthUrl() {
  const state = Math.random().toString(36).substring(7)
  const response = NextResponse.next()
  
  // Store state in cookies for validation
  response.cookies.set({
    name: 'bungie_auth_state',
    value: state,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 5 // 5 minutes
  })

  const params = new URLSearchParams({
    client_id: BUNGIE_CLIENT_ID!,
    response_type: 'code',
    redirect_uri: BUNGIE_REDIRECT_URI!,
    state
  })

  return {
    url: `${process.env.NEXT_PUBLIC_BUNGIE_OAUTH_AUTH_URL}?${params.toString()}`,
    response
  }
}

export async function refreshBungieTokens(refreshToken: string) {
  try {
    const tokenResponse = await axios.post(
      'https://www.bungie.net/Platform/App/OAuth/token/',
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: BUNGIE_CLIENT_ID!,
        client_secret: BUNGIE_CLIENT_SECRET!,
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-API-Key': BUNGIE_API_KEY!
        }
      }
    )

    return tokenResponse.data
  } catch (error) {
    console.error('Error refreshing Bungie tokens:', error)
    throw error
  }
}

export async function disconnectBungieAccount(userId: string) {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('bungie_accounts')
      .delete()
      .eq('user_id', userId)

    if (error) throw error

    return true
  } catch (error) {
    console.error('Error disconnecting Bungie account:', error)
    throw error
  }
} 