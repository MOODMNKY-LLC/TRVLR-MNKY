# Project Structure

## Directory Structure

```
├── app/
│   ├── api/
│   │   ├── bungie/          # Bungie.net API integration routes
│   │   ├── discord/         # Discord API integration routes
│   │   ├── loadouts/        # Loadout management routes
│   │   ├── manifest/        # Destiny 2 manifest sync routes
│   │   └── user/           # User profile and settings routes
│   ├── (auth-pages)/       # Authentication-related pages
│   └── (protected)/        # Protected routes requiring authentication
├── components/
│   ├── auth/               # Authentication-related components
│   ├── loadouts/           # Loadout management components
│   └── ui/                 # Shared UI components
├── lib/
│   ├── bungie/             # Bungie API utilities
│   ├── manifest/           # Manifest management utilities
│   └── supabase/           # Supabase client utilities
├── types/
│   ├── api.ts             # API route type definitions
│   ├── bungie.ts          # Bungie API type definitions
│   └── database.ts        # Supabase database type definitions
└── supabase/
    ├── functions/         # Edge Functions
    └── migrations/        # Database migrations
```

## Key Files

### API Routes
- `app/api/loadouts/route.ts`: Manages user loadouts (GET, POST)
- `app/api/user/settings/route.ts`: Handles user settings (GET, PATCH)

### Database Schema
- `supabase/migrations/20240107000001_create_user_tables.sql`: Creates user-related tables
  - `profiles`: User profile information
  - `settings`: User preferences and settings
  - `loadouts`: Saved loadout configurations

### Type Definitions
- `types/database.ts`: TypeScript interfaces for database tables
- `lib/supabase/client.ts`: Supabase client utilities for SSR

## Authentication Flow

1. User signs in via Discord OAuth
2. On successful auth, create/update profile in `profiles` table
3. Initialize default settings in `settings` table
4. Redirect to dashboard

## Data Models

### User Profile
```typescript
interface UserProfile {
  id: string                 // UUID, matches auth.users.id
  discord_id: string | null  // Discord user ID
  bungie_id: string | null   // Bungie.net membership ID
  display_name: string       // User's display name
  avatar_url: string | null  // Profile picture URL
}
```

### User Settings
```typescript
interface UserSettings {
  id: string                    // UUID
  user_id: string              // References auth.users.id
  theme: 'light' | 'dark' | 'system'
  notifications_enabled: boolean
  default_character_id: string | null
}
```

### Loadout
```typescript
interface Loadout {
  id: string                // UUID
  user_id: string          // References auth.users.id
  name: string             // Loadout name
  description: string | null
  character_class: 'hunter' | 'titan' | 'warlock'
  items: LoadoutItem[]     // Array of equipped items
  is_favorite: boolean
}
```

## Security

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own data
- Policies enforce user_id matching on all operations

### API Routes
- All routes validate authentication
- Use Supabase SSR middleware for session management
- Type-safe database operations

## Recent Configuration Changes

### Removal of Deno (January 2024)
The project has been updated to remove all Deno-related configurations and dependencies, transitioning to a pure Node.js/Next.js environment. The following changes were made:

1. **VS Code Configuration**
   - Removed Deno settings from `.vscode/settings.json`
   - Added TypeScript workspace SDK configuration:
     ```json
     {
       "typescript.tsdk": "node_modules/typescript/lib",
       "typescript.enablePromptUseWorkspaceTsdk": true
     }
     ```

2. **VS Code Extensions**
   - Removed Deno extension recommendation from `.vscode/extensions.json`
   - Updated to empty recommendations array:
     ```json
     {
       "recommendations": []
     }
     ```

3. **Supabase Configuration**
   - Removed Deno-specific import map reference from `supabase/config.toml`
   - Cleaned up Edge Functions configuration to use standard Node.js/TypeScript setup

### Impact of Changes
- Build process now uses Node.js/TypeScript toolchain exclusively
- Edge Functions can be written in TypeScript/JavaScript without Deno runtime
- Development environment is simplified with consistent Node.js tooling
- VS Code configuration is optimized for Next.js/TypeScript development

### Next Steps
- Use `npm` or `yarn` for package management
- Write Edge Functions using TypeScript/JavaScript
- Configure TypeScript settings in `tsconfig.json` for optimal IDE support
``` 