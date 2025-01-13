# Discord Authentication with Supabase

This document outlines the setup and implementation of Discord authentication using Supabase in a Next.js application with the App Router.

## Major Changes (2024 Update)
1. Migrated to `@supabase/ssr` from `@supabase/auth-helpers-nextjs`
2. Using `createBrowserClient` for client-side and `createServerClient` for server-side
3. Updated cookie handling in callback route
4. Improved error handling and redirects
5. Added support for Discord guild scopes

## Environment Setup

1. **Required Environment Variables**:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_AUTH_DISCORD_CLIENT_ID=your_discord_client_id
SUPABASE_AUTH_DISCORD_CLIENT_SECRET=your_discord_client_secret
```

2. **Discord Developer Setup**:
   - Create application at [Discord Developer Portal](https://discord.com/developers/applications)
   - Add OAuth2 redirect URL: `https://your-domain.com/auth/callback`
   - Request required scopes: `identify email guilds`

## Implementation

### 1. Discord Sign-In Component

```typescript
'use client'

import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { DiscordLogoIcon } from '@radix-ui/react-icons'
import { useState } from 'react'

export function DiscordSignIn() {
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
          scopes: 'identify email guilds',
        }
      })

      if (error) throw error
      if (data?.url) window.location.assign(data.url)
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
      className="w-full"
    >
      {isLoading ? (
        <span className="loading loading-spinner loading-sm"></span>
      ) : (
        <DiscordLogoIcon className="mr-2 h-4 w-4" />
      )}{' '}
      Discord
    </Button>
  )
}
```

### 2. OAuth Callback Handler

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    let response = NextResponse.redirect(new URL(next, origin))

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: { path: string; maxAge?: number; domain?: string; sameSite?: string }) {
            response.cookies.set({
              name,
              value,
              ...options,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
            })
          },
          remove(name: string, options: { path: string; domain?: string }) {
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

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return response
  }

  return NextResponse.redirect(new URL('/auth/auth-code-error', origin))
}
```

## Database Schema

The following tables are created automatically by Supabase and extended by our migrations:

```sql
-- profiles table with Discord-specific fields
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  discord_id text unique,
  name text,
  email text,
  avatar_url text,
  global_name text,
  raw_metadata jsonb
);

-- Discord guilds table
create table if not exists discord_guilds (
  id text primary key,
  name text not null,
  icon text,
  features jsonb default '[]'::jsonb
);

-- Guild memberships table
create table if not exists guild_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  guild_id text references discord_guilds(id) on delete cascade not null,
  is_owner boolean default false,
  permissions bigint not null,
  unique(user_id, guild_id)
);
```

## Security Considerations

1. **Cookie Security**:
   - `sameSite: 'lax'` for better security
   - `secure: true` in production
   - Proper cookie expiration handling

2. **Environment Variables**:
   - Keep secrets in `.env.local`
   - Only expose necessary variables to client

3. **Scopes**:
   - Request minimum required Discord scopes
   - Handle guild permissions carefully

4. **Error Handling**:
   - Dedicated error page for auth failures
   - Proper error logging
   - User-friendly error messages

## Common Issues & Solutions

1. **Session Not Persisting**:
   - Ensure cookie handling in callback route is correct
   - Check domain configuration
   - Verify SSL in production

2. **Discord Authorization Failed**:
   - Verify redirect URLs match exactly
   - Check scope permissions
   - Validate client ID and secret

3. **CORS Issues**:
   - Use correct origin URLs
   - Handle development vs production URLs
   - Check Supabase project settings

## Testing

1. **Development Flow**:
   ```bash
   # Start development server
   npm run dev
   
   # Use localhost:3000 or 127.0.0.1:3000
   # Avoid using HTTPS in development unless properly configured
   ```

2. **Test Cases**:
   - New user sign-up
   - Existing user sign-in
   - Session persistence
   - Error handling
   - Guild permissions sync

## Deployment Checklist

1. Configure production environment variables
2. Update Discord OAuth2 redirect URLs
3. Enable proper SSL/HTTPS
4. Test all auth flows in production
5. Monitor error logs
6. Set up proper CORS configuration 