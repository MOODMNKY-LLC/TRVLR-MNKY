-- Create the discord_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS discord_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  discord_id TEXT UNIQUE,
  username TEXT,
  global_name TEXT,
  email TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  accent_color INTEGER,
  locale TEXT,
  verified BOOLEAN,
  mfa_enabled BOOLEAN,
  premium_type INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Add new JSONB columns for complete OAuth data
ALTER TABLE discord_profiles
ADD COLUMN IF NOT EXISTS raw_user_meta_data JSONB,
ADD COLUMN IF NOT EXISTS custom_claims JSONB,
ADD COLUMN IF NOT EXISTS discord_data JSONB;

-- Create a function to update discord profile with complete OAuth data
CREATE OR REPLACE FUNCTION public.update_discord_profile_with_oauth_data(
  p_user_id UUID,
  p_raw_user_meta_data JSONB,
  p_custom_claims JSONB,
  p_discord_data JSONB
) RETURNS void AS $$
BEGIN
  -- Update existing profile or insert new one
  INSERT INTO discord_profiles (
    id,
    user_id,
    discord_id,
    username,
    global_name,
    email,
    avatar_url,
    banner_url,
    accent_color,
    locale,
    verified,
    mfa_enabled,
    premium_type,
    raw_user_meta_data,
    custom_claims,
    discord_data,
    updated_at
  )
  VALUES (
    gen_random_uuid(),
    p_user_id,
    p_discord_data->>'id',
    p_discord_data->>'username',
    p_discord_data->>'global_name',
    p_discord_data->>'email',
    p_raw_user_meta_data->>'avatar_url',
    CASE 
      WHEN p_discord_data->>'banner' IS NOT NULL 
      THEN 'https://cdn.discordapp.com/banners/' || (p_discord_data->>'id') || '/' || (p_discord_data->>'banner') || '.png'
      ELSE NULL
    END,
    (p_discord_data->>'accent_color')::integer,
    p_discord_data->>'locale',
    (p_discord_data->>'verified')::boolean,
    (p_discord_data->>'mfa_enabled')::boolean,
    (p_discord_data->>'premium_type')::integer,
    p_raw_user_meta_data,
    p_custom_claims,
    p_discord_data,
    now()
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    discord_id = EXCLUDED.discord_id,
    username = EXCLUDED.username,
    global_name = EXCLUDED.global_name,
    email = EXCLUDED.email,
    avatar_url = EXCLUDED.avatar_url,
    banner_url = EXCLUDED.banner_url,
    accent_color = EXCLUDED.accent_color,
    locale = EXCLUDED.locale,
    verified = EXCLUDED.verified,
    mfa_enabled = EXCLUDED.mfa_enabled,
    premium_type = EXCLUDED.premium_type,
    raw_user_meta_data = EXCLUDED.raw_user_meta_data,
    custom_claims = EXCLUDED.custom_claims,
    discord_data = EXCLUDED.discord_data,
    updated_at = EXCLUDED.updated_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies for the new columns
ALTER TABLE discord_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own discord profile data"
  ON discord_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own discord profile data"
  ON discord_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON discord_profiles TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_discord_profile_with_oauth_data TO authenticated;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_discord_profiles_user_id ON discord_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_discord_profiles_discord_id ON discord_profiles(discord_id);

-- Add trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_discord_profiles_updated_at
    BEFORE UPDATE ON discord_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE discord_profiles IS 'Stores comprehensive Discord profile data including raw OAuth response';
COMMENT ON COLUMN discord_profiles.raw_user_meta_data IS 'Complete raw user metadata from Discord OAuth response';
COMMENT ON COLUMN discord_profiles.custom_claims IS 'Custom claims from Discord OAuth response';
COMMENT ON COLUMN discord_profiles.discord_data IS 'Detailed Discord user data from OAuth response'; 