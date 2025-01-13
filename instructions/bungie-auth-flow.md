# Bungie Authentication Flow

## Overview
This document outlines the implementation of Bungie.net OAuth2 authentication in our application, which allows Discord-authenticated users to link their Bungie accounts.

## Database Schema

### Bungie Accounts Table
```sql
create table bungie_accounts (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  access_token text not null,
  refresh_token text not null,
  expires_at timestamp with time zone not null,
  membership_id text not null,
  token_type text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id)  -- Ensures one Bungie account per user
);
```

### RLS Policies
```sql
-- Enable RLS
alter table bungie_accounts enable row level security;

-- Users can only view their own Bungie account
create policy "Users can view their own Bungie accounts"
  on bungie_accounts for select
  using (auth.uid() = user_id);

-- Users can update their own Bungie account
create policy "Users can update their own Bungie accounts"
  on bungie_accounts for update
  using (auth.uid() = user_id);

-- Users can insert their own Bungie account
create policy "Users can insert their own Bungie accounts"
  on bungie_accounts for insert
  with check (auth.uid() = user_id);
```

## Components

### LoginGhost Component (`components/login-ghost.tsx`)
- Provides a polished UI for Bungie authentication
- Handles the initial OAuth redirect
- Shows loading state during authentication
- Uses environment variables for Bungie OAuth configuration

### Auth Confirmation Dialog (`components/auth-confirmation-dialog.tsx`)
- Displays success message after successful authentication
- Provides feedback to user about account linking
- Handles navigation after completion

## API Routes

### Token Exchange (`app/api/bungie/token/route.ts`)
```typescript
// Key functionality:
// 1. Verifies Discord authentication
// 2. Exchanges Bungie auth code for tokens
// 3. Stores tokens in bungie_accounts table
// 4. Links Bungie account to Discord user

export async function POST(request: Request) {
  // Get authenticated Discord user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Exchange code for Bungie tokens
  const tokenResponse = await axios.post(
    'https://www.bungie.net/platform/app/oauth/token/',
    new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: process.env.BUNGIE_CLIENT_ID!,
      client_secret: process.env.BUNGIE_CLIENT_SECRET!,
    }).toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-API-Key': process.env.BUNGIE_API_KEY!
      }
    }
  )

  // Store tokens in database
  await supabase.from('bungie_accounts').upsert({
    user_id: user.id,
    membership_id: tokenResponse.data.membership_id,
    access_token: tokenResponse.data.access_token,
    refresh_token: tokenResponse.data.refresh_token,
    token_type: tokenResponse.data.token_type,
    expires_at: new Date(Date.now() + tokenResponse.data.expires_in * 1000)
  }, {
    onConflict: 'user_id'
  })
}
```

## Environment Variables
```env
# Bungie OAuth Configuration
BUNGIE_CLIENT_ID=your_client_id
BUNGIE_CLIENT_SECRET=your_client_secret
BUNGIE_API_KEY=your_api_key
NEXT_PUBLIC_BUNGIE_OAUTH_AUTH_URL=https://www.bungie.net/en/oauth/authorize
NEXT_PUBLIC_BUNGIE_REDIRECT_URI=http://localhost:3000/bungie/auth/callback
```

## Authentication Flow
1. User authenticates with Discord
2. User clicks "Link Bungie Account" button
3. User is redirected to Bungie.net OAuth page
4. After approval, Bungie redirects to our callback URL
5. We exchange the code for tokens
6. Tokens are stored in database, linked to Discord user
7. Success dialog is shown to user

## Security Considerations
- All Bungie tokens are stored server-side
- RLS ensures users can only access their own data
- Refresh tokens are handled securely
- OAuth state parameter used for CSRF protection
- Proper error handling and user feedback

## Error Handling
- Invalid/expired tokens
- Network failures
- Database errors
- User cancellation
- Rate limiting

## Future Improvements
- Implement token refresh logic
- Add token revocation on account unlinking
- Add Bungie account status indicators
- Implement manifest data sync
- Add inventory management features 