-- Drop existing function
DROP FUNCTION IF EXISTS update_discord_profile_with_oauth_data;

-- Create function
CREATE FUNCTION update_discord_profile_with_oauth_data(
  p_user_id uuid,
  p_raw_user_meta_data jsonb,
  p_custom_claims jsonb,
  p_discord_data jsonb
) RETURNS discord_profiles AS $$
DECLARE
  result discord_profiles;
BEGIN
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
  ON CONFLICT (user_id) DO UPDATE
  SET
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
    updated_at = EXCLUDED.updated_at
  RETURNING *
  INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION update_discord_profile_with_oauth_data TO authenticated; 