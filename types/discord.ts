// Discord OAuth2 API Response Types
export interface DiscordAPIUser {
  id: string
  username: string
  discriminator: string
  global_name: string | null
  avatar: string | null
  bot?: boolean
  system?: boolean
  mfa_enabled?: boolean
  banner?: string | null
  accent_color?: number | null
  locale?: string
  verified?: boolean
  email?: string | null
  flags?: number
  premium_type?: number
  public_flags?: number
  avatar_decoration?: string | null
}

// Discord OAuth2 Scopes and Claims
export interface DiscordOAuthClaims {
  premium_type?: number
  flags?: number
  banner?: string | null
  banner_color?: string | null
  accent_color?: number | null
  locale?: string
  mfa_enabled?: boolean
  avatar_decoration?: string | null
  discriminator?: string
  display_name?: string | null
  global_name?: string | null
}

// Database Types
export interface DiscordProfile {
  id: string
  user_id: string
  discord_id: string
  username: string
  global_name: string | null
  email: string | null
  avatar_url: string | null
  banner_url: string | null
  accent_color: number | null
  locale: string | null
  verified: boolean
  mfa_enabled: boolean
  premium_type: number | null
  premium_type_name: DiscordPremiumTypeName
  parsed_flags: DiscordUserFlagsStruct
  created_at: string
  updated_at: string
  raw_user_meta_data?: Record<string, any>
  custom_claims?: DiscordOAuthClaims
  discord_data?: DiscordAPIUser
}

// Premium Type Enum (matches database)
export type DiscordPremiumTypeName = 'None' | 'NitroClassic' | 'Nitro' | 'NitroBasic'

export enum DiscordPremiumType {
  None = 0,
  NitroClassic = 1,
  Nitro = 2,
  NitroBasic = 3
}

// User Flags Structure (matches database)
export interface DiscordUserFlagsStruct {
  is_staff: boolean
  is_partner: boolean
  hypesquad: boolean
  bug_hunter_level1: boolean
  hypesquad_bravery: boolean
  hypesquad_brilliance: boolean
  hypesquad_balance: boolean
  premium_early_supporter: boolean
  team_pseudo_user: boolean
  bug_hunter_level2: boolean
  verified_bot: boolean
  verified_developer: boolean
  certified_moderator: boolean
  bot_http_interactions: boolean
  active_developer: boolean
}

// User Flags Enum (for bitwise operations)
export enum DiscordUserFlags {
  Staff = 1 << 0,
  Partner = 1 << 1,
  HypeSquad = 1 << 2,
  BugHunterLevel1 = 1 << 3,
  HypesquadOnlineHouse1 = 1 << 6, // Bravery
  HypesquadOnlineHouse2 = 1 << 7, // Brilliance
  HypesquadOnlineHouse3 = 1 << 8, // Balance
  PremiumEarlySupporter = 1 << 9,
  TeamPseudoUser = 1 << 10,
  BugHunterLevel2 = 1 << 14,
  VerifiedBot = 1 << 16,
  VerifiedDeveloper = 1 << 17,
  CertifiedModerator = 1 << 18,
  BotHttpInteractions = 1 << 19,
  ActiveDeveloper = 1 << 22
}

// Helper Types
export interface DiscordUserRole {
  user_id: string
  role: string[]
}

// Utility function for parsing Discord flags
export function parseDiscordFlags(flags: number): string[] {
  const userFlags: string[] = []
  
  Object.entries(DiscordUserFlags).forEach(([flagName, flagValue]) => {
    if (typeof flagValue === 'number' && (flags & flagValue) === flagValue) {
      userFlags.push(flagName)
    }
  })
  
  return userFlags
}

// Utility function for getting premium status
export function getPremiumTypeName(type: number | null | undefined): DiscordPremiumTypeName {
  switch (type) {
    case DiscordPremiumType.NitroClassic:
      return 'NitroClassic'
    case DiscordPremiumType.Nitro:
      return 'Nitro'
    case DiscordPremiumType.NitroBasic:
      return 'NitroBasic'
    default:
      return 'None'
  }
} 