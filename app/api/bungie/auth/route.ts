import { NextResponse } from 'next/server'
import { getBungieAuthUrl } from '@/lib/bungie/api'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  try {
    // Check if user is authenticated
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Generate auth URL with state
    const { url, response } = await getBungieAuthUrl()

    // Create a new response with the URL and copy the cookies
    const finalResponse = NextResponse.json({ url })
    response.cookies.getAll().forEach(cookie => {
      finalResponse.cookies.set(cookie)
    })
    
    return finalResponse
  } catch (error) {
    console.error('Error initiating Bungie auth:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 