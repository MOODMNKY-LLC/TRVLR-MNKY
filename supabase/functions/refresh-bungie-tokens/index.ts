import { createClient } from '@supabase/supabase-js'
import { refreshBungieTokens } from '../../../lib/bungie/api'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const refreshExpiringSoonTokens = async () => {
  try {
    // Get accounts with auto sync enabled and tokens expiring in the next hour
    const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000).toISOString()
    
    const { data: accounts, error } = await supabase
      .from('bungie_accounts')
      .select('*')
      .eq('auto_sync', true)
      .lt('expires_at', oneHourFromNow)

    if (error) throw error

    console.log(`Found ${accounts?.length || 0} accounts needing token refresh`)

    // Refresh tokens for each account
    for (const account of accounts || []) {
      try {
        const tokens = await refreshBungieTokens(account.refresh_token)
        
        // Calculate new expiration
        const expiresAt = new Date(Date.now() + tokens.expires_in * 1000)

        // Update tokens in database
        const { error: updateError } = await supabase
          .from('bungie_accounts')
          .update({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at: expiresAt.toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', account.user_id)

        if (updateError) throw updateError

        console.log(`Successfully refreshed tokens for user ${account.user_id}`)
      } catch (error) {
        console.error(`Failed to refresh tokens for user ${account.user_id}:`, error)
        // Continue with next account even if one fails
      }
    }

    return { success: true, message: `Processed ${accounts?.length || 0} accounts` }
  } catch (error) {
    console.error('Error in refreshExpiringSoonTokens:', error)
    return { success: false, error: String(error) }
  }
}

// Edge function handler
export const handler = async () => {
  try {
    const result = await refreshExpiringSoonTokens()
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
      status: result.success ? 200 : 500
    })
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: String(error) }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
} 