import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

async function fetchDiscordUserData(access_token: string) {
  const response = await fetch('https://discord.com/api/v10/users/@me', {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  })
  
  if (!response.ok) {
    console.error('Failed to fetch Discord user data:', await response.text())
    return null
  }
  
  return response.json()
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/protected'

  if (!code) {
    return NextResponse.redirect(new URL('/auth/auth-code-error', origin))
  }

  const cookieStore = request.cookies
  const response = NextResponse.redirect(new URL(next, origin))

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: -1,
          })
        },
      },
    }
  )

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) throw error

    // Get the access token from the provider token
    const providerToken = data.session?.provider_token
    
    if (providerToken) {
      // Fetch additional user data from Discord
      const discordData = await fetchDiscordUserData(providerToken)
      
      if (discordData) {
        // Merge Discord data with existing metadata
        const updatedMetadata = {
          ...data.user?.user_metadata,
          custom_claims: {
            ...data.user?.user_metadata.custom_claims,
            premium_type: discordData.premium_type,
            flags: discordData.flags,
            banner: discordData.banner,
            banner_color: discordData.banner_color,
            accent_color: discordData.accent_color,
            locale: discordData.locale,
            mfa_enabled: discordData.mfa_enabled,
            avatar_decoration: discordData.avatar_decoration,
            discriminator: discordData.discriminator,
            display_name: discordData.display_name,
            global_name: discordData.global_name
          },
          discord_data: discordData
        }

        // Update the user's metadata with the additional Discord data
        await supabase.auth.updateUser({
          data: updatedMetadata
        })

        // Store the complete Discord profile data
        const { error: profileError } = await supabase.rpc(
          'update_discord_profile_with_oauth_data',
          {
            p_user_id: data.user?.id,
            p_raw_user_meta_data: updatedMetadata,
            p_custom_claims: updatedMetadata.custom_claims,
            p_discord_data: discordData
          }
        )

        if (profileError) {
          console.error('Failed to update Discord profile:', profileError)
        }
      }
    }

    return response
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.redirect(new URL('/auth/auth-code-error', origin))
  }
}
