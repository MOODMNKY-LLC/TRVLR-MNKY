'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DiscordLogoIcon, PersonIcon, CalendarIcon, CheckCircledIcon } from "@radix-ui/react-icons"
import { AtSign, Hash, Star, Globe, Shield, Flag } from "lucide-react"
import Image from "next/image"
import { formatDistanceToNow } from 'date-fns'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { type DiscordProfile } from "@/types/discord"

interface DiscordUserProfileCardProps {
  profile: DiscordProfile
}

export function DiscordUserProfileCard({ profile }: DiscordUserProfileCardProps) {
  if (!profile) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <p className="text-muted-foreground">No Discord profile data available</p>
      </div>
    )
  }

  // Helper function to format dates
  function formatDate(dateString?: string) {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true, includeSeconds: false })
  }

  // Get the display name with fallbacks
  const displayName = profile.global_name || profile.username || 'Discord User'
  const username = profile.username || 'Unknown Username'
  const discriminator = profile.custom_claims?.discriminator
  const hasLegacyUsername = discriminator && discriminator !== '0'

  // Get user flags as an array of booleans for easy rendering
  const activeFlags = Object.entries(profile.parsed_flags)
    .filter(([_, isActive]) => isActive)
    .map(([flagName]) => flagName.split('_').map(
      word => word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '))

  return (
    <Card className="w-full max-w-2xl overflow-hidden">
      {/* Banner Section */}
      <div 
        className="relative h-24" 
        style={{
          backgroundColor: profile.accent_color ? 
            `#${profile.accent_color.toString(16)}` : 
            'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
        }}
      >
        {profile.banner_url && (
          <Image
            src={profile.banner_url}
            alt="Profile Banner"
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Avatar Section */}
      <div className="relative px-6">
        <div className="absolute -top-12 ring-4 ring-background rounded-full">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt="Discord Avatar"
              width={80}
              height={80}
              className="rounded-full"
            />
          ) : (
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
              <PersonIcon className="w-10 h-10 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>

      <CardHeader className="pt-12 pb-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl flex items-center gap-2">
            {displayName}
            {profile.premium_type_name !== 'None' && (
              <Badge variant="secondary" className="gap-1">
                <Star className="w-3 h-3" />
                {profile.premium_type_name.replace(/([A-Z])/g, ' $1').trim()}
              </Badge>
            )}
          </CardTitle>
        </div>
        <CardDescription className="flex items-center gap-2">
          <DiscordLogoIcon className="w-4 h-4" />
          {username}
          {hasLegacyUsername && (
            <span>#{discriminator}</span>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Basic Info Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AtSign className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Email:</span>
            <span>{profile.email || 'Not provided'}</span>
            {profile.verified && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <CheckCircledIcon className="w-4 h-4 ml-auto text-emerald-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Email Verified</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Discord ID:</span>
            <span className="font-mono text-xs">{profile.discord_id}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Locale:</span>
            <span>{profile.locale || 'Not set'}</span>
          </div>
          {profile.mfa_enabled && (
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">2FA Enabled</span>
            </div>
          )}
          {activeFlags.length > 0 && (
            <div className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Badges:</span>
              <div className="flex flex-wrap gap-1">
                {activeFlags.map((flag) => (
                  <Badge key={flag} variant="outline" className="text-xs">
                    {flag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          <Separator />
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Created:</span>
            <span>{formatDate(profile.created_at)}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Updated:</span>
            <span>{formatDate(profile.updated_at)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 