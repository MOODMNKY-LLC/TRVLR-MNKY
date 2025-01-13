-- Drop existing objects
DROP FUNCTION IF EXISTS parse_discord_flags;
DROP FUNCTION IF EXISTS get_premium_type_name;
DROP TYPE IF EXISTS discord_user_flags;
DROP TYPE IF EXISTS discord_premium_type;

-- Create enum type
CREATE TYPE discord_premium_type AS ENUM ('None', 'NitroClassic', 'Nitro', 'NitroBasic');

-- Create composite type
CREATE TYPE discord_user_flags AS (
  is_staff boolean,
  is_partner boolean,
  hypesquad boolean,
  bug_hunter_level1 boolean,
  hypesquad_bravery boolean,
  hypesquad_brilliance boolean,
  hypesquad_balance boolean,
  premium_early_supporter boolean,
  team_pseudo_user boolean,
  bug_hunter_level2 boolean,
  verified_bot boolean,
  verified_developer boolean,
  certified_moderator boolean,
  bot_http_interactions boolean,
  active_developer boolean
);

-- Create functions
CREATE FUNCTION parse_discord_flags(flags bigint) RETURNS discord_user_flags AS $$
DECLARE
  result discord_user_flags;
BEGIN
  result.is_staff := (flags & (1<<0)) > 0;
  result.is_partner := (flags & (1<<1)) > 0;
  result.hypesquad := (flags & (1<<2)) > 0;
  result.bug_hunter_level1 := (flags & (1<<3)) > 0;
  result.hypesquad_bravery := (flags & (1<<6)) > 0;
  result.hypesquad_brilliance := (flags & (1<<7)) > 0;
  result.hypesquad_balance := (flags & (1<<8)) > 0;
  result.premium_early_supporter := (flags & (1<<9)) > 0;
  result.team_pseudo_user := (flags & (1<<10)) > 0;
  result.bug_hunter_level2 := (flags & (1<<14)) > 0;
  result.verified_bot := (flags & (1<<16)) > 0;
  result.verified_developer := (flags & (1<<17)) > 0;
  result.certified_moderator := (flags & (1<<18)) > 0;
  result.bot_http_interactions := (flags & (1<<19)) > 0;
  result.active_developer := (flags & (1<<22)) > 0;
  RETURN result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE FUNCTION get_premium_type_name(type_num integer) RETURNS discord_premium_type AS $$
BEGIN
  RETURN CASE type_num
    WHEN 0 THEN 'None'::discord_premium_type
    WHEN 1 THEN 'NitroClassic'::discord_premium_type
    WHEN 2 THEN 'Nitro'::discord_premium_type
    WHEN 3 THEN 'NitroBasic'::discord_premium_type
    ELSE 'None'::discord_premium_type
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add columns
ALTER TABLE discord_profiles
ADD COLUMN IF NOT EXISTS parsed_flags discord_user_flags 
  GENERATED ALWAYS AS (
    parse_discord_flags(
      CASE 
        WHEN discord_data->>'flags' IS NOT NULL 
        THEN (discord_data->>'flags')::bigint 
        ELSE 0 
      END
    )
  ) STORED,
ADD COLUMN IF NOT EXISTS premium_type_name discord_premium_type 
  GENERATED ALWAYS AS (
    get_premium_type_name(premium_type)
  ) STORED;

-- Create index
CREATE INDEX IF NOT EXISTS idx_discord_profiles_premium_type 
ON discord_profiles(premium_type_name);

-- Add comments
COMMENT ON COLUMN discord_profiles.parsed_flags IS 'Parsed Discord user flags as a structured type';
COMMENT ON COLUMN discord_profiles.premium_type_name IS 'Human-readable premium status';
COMMENT ON TYPE discord_premium_type IS 'Enum for Discord Nitro subscription levels';
COMMENT ON TYPE discord_user_flags IS 'Structured type for Discord user flags/badges';
COMMENT ON FUNCTION parse_discord_flags IS 'Converts numeric Discord flags to structured boolean flags';
COMMENT ON FUNCTION get_premium_type_name IS 'Converts numeric premium type to enum value'; 