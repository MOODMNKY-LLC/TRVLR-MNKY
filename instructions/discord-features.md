# Discord Integration Features

## Overview
This document outlines the planned phases for integrating Discord features into our D2 Clan App. Each phase builds upon the previous one, ensuring stable and tested functionality before moving forward.

## Phase 1: Basic Guild/Server Integration
### Database Schema
```sql
-- Discord guilds table
create table discord_guilds (
  id text primary key,                      -- Discord's guild ID
  name text not null,                       -- Guild name
  icon text,                                -- Guild icon hash
  features jsonb default '[]'::jsonb,       -- Guild features array
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

-- Guild memberships table
create table guild_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  guild_id text references discord_guilds(id) on delete cascade not null,
  is_owner boolean default false,           -- Whether user owns the guild
  permissions bigint not null,              -- User's guild permissions
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  unique(user_id, guild_id)
);
```

### Features
- Basic server membership tracking
- Server ownership status
- User permissions within servers
- Automatic sync of user's servers
- Row Level Security for data protection

### OAuth2 Scope Required
- `guilds` - Read user's server list

## Phase 2: Detailed Guild Member Data
### Planned Features
- Member role tracking
- Nickname support
- Join date tracking
- Voice status tracking
- Member screening status

### OAuth2 Scope Required
- `guilds.members.read` - Access member objects

## Phase 3: User Connections
### Planned Features
- Third-party account linking (Twitch, YouTube, etc.)
- Connection verification status
- Friend sync status
- Activity visibility
- Connection privacy settings

### OAuth2 Scope Required
- `connections` - Access third-party connections

## Phase 4: Role Connections
### Planned Features
- Linked role management
- Application role connection settings
- Role metadata synchronization
- Automated role assignments

### OAuth2 Scope Required
- `role_connections.write` - Manage linked roles

## Implementation Notes

### Security Considerations
1. **Row Level Security (RLS)**
   - Users can only view their own guild memberships
   - Guild data visible only to members
   - System-level access for sync operations

2. **Data Privacy**
   - Store only necessary Discord data
   - Respect user privacy settings
   - Handle connection visibility appropriately

### Performance Optimization
1. **Indexes**
   - Guild membership lookups
   - User-specific queries
   - Connection filtering

2. **Caching Strategy**
   - Cache frequently accessed guild data
   - Implement efficient sync mechanisms
   - Handle rate limits appropriately

### Future Expansion Ideas
1. **Server Management**
   - Role management interface
   - Member management tools
   - Server settings synchronization

2. **Integration Features**
   - Twitch stream notifications
   - YouTube video announcements
   - Cross-platform activity sync

3. **Analytics**
   - Server activity tracking
   - Member engagement metrics
   - Connection usage statistics

## API Integration Points

### Discord API Endpoints
1. **Guild Data**
   ```typescript
   GET /users/@me/guilds
   Response: {
     id: string;
     name: string;
     icon: string;
     owner: boolean;
     permissions: string;
     features: string[];
   }[]
   ```

2. **Member Data**
   ```typescript
   GET /guilds/{guild.id}/members/{user.id}
   Response: {
     user: User;
     nick: string;
     roles: string[];
     joined_at: string;
     deaf: boolean;
     mute: boolean;
     pending: boolean;
   }
   ```

3. **User Connections**
   ```typescript
   GET /users/@me/connections
   Response: {
     id: string;
     name: string;
     type: string;
     verified: boolean;
     friend_sync: boolean;
     show_activity: boolean;
     visibility: number;
   }[]
   ```

### Error Handling
1. **Rate Limits**
   - Implement exponential backoff
   - Queue requests when necessary
   - Cache responses appropriately

2. **API Failures**
   - Graceful degradation
   - User-friendly error messages
   - Automatic retry mechanisms

## Testing Strategy

### Unit Tests
1. **Database Operations**
   - Guild creation/updates
   - Membership management
   - Connection handling

2. **Security Rules**
   - RLS policy validation
   - Access control verification
   - Permission checks

### Integration Tests
1. **Discord API**
   - OAuth flow
   - Data synchronization
   - Error handling

2. **User Flows**
   - Server joining/leaving
   - Role updates
   - Connection management

### End-to-End Tests
1. **Complete Flows**
   - User authentication
   - Server management
   - Connection integration

2. **Edge Cases**
   - API failures
   - Permission changes
   - Data conflicts 

## OAuth2 Scopes Implementation

### Currently Implemented Scopes
- `identify` - Basic user information (ID, username, avatar)
- `email` - User's email address
- `guilds` - List of user's Discord servers
- `guilds.members.read` - Detailed member information in servers
- `connections` - User's connected third-party accounts
- `activities.read` - User's "Now Playing/Recently Played" data

### Planned Additional Scopes
These scopes will be implemented in future phases, pending Discord approval where required:

#### User Data & Relationships
- `relationships.read` - Access to user's friends list and relationships
  - *Requires Discord approval*
  - Use case: Friend discovery and social features

#### Guild & Channel Access
- `guilds.join` - Ability to add users to guilds
  - Use case: Automatic clan server joining
- `dm_channels.read` - Access to DM information
  - *Requires Discord approval*
  - Use case: Integrated messaging features

#### Voice Integration
- `voice` - Voice connection capabilities
  - *Requires Discord approval*
  - Use case: In-app voice chat integration

#### Rich Presence & Activities
- `activities.write` - Update user's activity
  - *Not currently available for apps*
  - Use case: Game status synchronization
- `rpc` & related scopes - Local Discord client control
  - *Requires Discord approval*
  - Use case: Enhanced desktop integration

#### Application Management
- `applications.commands` - Add slash commands to guilds
  - Use case: Custom bot commands
- `webhook.incoming` - Create webhooks for notifications
  - Use case: Automated announcements

### Implementation Notes
1. **Approval Requirements**
   - Several scopes require explicit Discord approval
   - Applications must justify use cases for restricted scopes
   - Some scopes are currently unavailable for general apps

2. **Security Considerations**
   - OAuth state parameter used for CSRF protection
   - Scopes stored securely in user session
   - Regular token rotation and validation

3. **User Privacy**
   - Clear disclosure of data access
   - Granular permission controls
   - Option to revoke specific scopes

4. **Technical Implementation**
```typescript
// OAuth configuration in discord-auth-button.tsx
const scopes = [
  'identify',
  'email',
  'guilds',
  'guilds.members.read',
  'connections',
  'activities.read'
].join(' ')

// Additional scopes pending approval
const futureScopesRequiringApproval = [
  'relationships.read',
  'dm_channels.read',
  'voice',
  'rpc'
]
```

5. **Database Schema Support**
```sql
-- Profile table includes fields for all authorized scopes
alter table profiles
  add column authorized_scopes text[],
  add column scope_updated_at timestamp with time zone;

-- Track scope-specific data access
create table scope_access_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  scope text not null,
  accessed_at timestamp with time zone default now(),
  purpose text
);
```

### Scope Request Process
1. **Initial Authentication**
   - Request minimal scopes (`identify`, `email`)
   - Essential for basic functionality

2. **Feature-Based Scope Requests**
   - Additional scopes requested based on feature usage
   - Clear user consent for each new scope
   - Graceful fallback if scopes are denied

3. **Approval Process**
   - Document use cases for restricted scopes
   - Submit detailed implementation plans
   - Comply with Discord's security requirements

4. **Monitoring & Compliance**
   - Track scope usage patterns
   - Regular audit of authorized scopes
   - Remove unused scope access 