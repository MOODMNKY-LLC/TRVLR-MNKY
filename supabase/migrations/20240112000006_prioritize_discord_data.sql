-- Migration: 20240112000006_prioritize_discord_data.sql
-- Description: Update handle_new_user function to prioritize discord_data over custom_claims

create or replace function public.handle_new_user() 
returns trigger
language plpgsql security definer
as $$
declare
  _raw_meta jsonb;
  _custom_claims jsonb;
  _discord_data jsonb;
begin
  -- Get the raw metadata, custom claims, and discord data
  _raw_meta := new.raw_user_meta_data;
  _custom_claims := coalesce(_raw_meta->'custom_claims', '{}'::jsonb);
  _discord_data := coalesce(_raw_meta->'discord_data', '{}'::jsonb);

  -- Insert profile data with new fields, prioritizing discord_data over custom_claims
  insert into public.profiles (
    id,
    discord_id,
    name,
    email,
    email_verified,
    phone_verified,
    picture,
    avatar_url,
    full_name,
    provider_id,
    global_name,
    premium_type,
    flags,
    banner_url,
    banner_color,
    discriminator,
    locale,
    mfa_enabled,
    accent_color,
    avatar_decoration,
    banner,
    display_name,
    raw_metadata
  )
  values (
    new.id,
    _raw_meta->>'sub',
    _raw_meta->>'name',
    _raw_meta->>'email',
    (_raw_meta->>'email_verified')::boolean,
    (_raw_meta->>'phone_verified')::boolean,
    _raw_meta->>'picture',
    _raw_meta->>'avatar_url',
    _raw_meta->>'full_name',
    _raw_meta->>'provider_id',
    coalesce(_discord_data->>'global_name', _custom_claims->>'global_name'),
    coalesce((_discord_data->>'premium_type')::smallint, (_custom_claims->>'premium_type')::smallint),
    coalesce((_discord_data->>'flags')::bigint, (_custom_claims->>'flags')::bigint),
    case 
      when coalesce(_discord_data->>'banner', _custom_claims->>'banner') is not null 
      then format('https://cdn.discordapp.com/banners/%s/%s.png', _raw_meta->>'sub', coalesce(_discord_data->>'banner', _custom_claims->>'banner'))
      else null
    end,
    coalesce(_discord_data->>'banner_color', _custom_claims->>'banner_color'),
    coalesce(_discord_data->>'discriminator', _custom_claims->>'discriminator'),
    coalesce(_discord_data->>'locale', _custom_claims->>'locale'),
    coalesce((_discord_data->>'mfa_enabled')::boolean, (_custom_claims->>'mfa_enabled')::boolean),
    coalesce((_discord_data->>'accent_color')::integer, (_custom_claims->>'accent_color')::integer),
    coalesce(_discord_data->>'avatar_decoration', _custom_claims->>'avatar_decoration'),
    coalesce(_discord_data->>'banner', _custom_claims->>'banner'),
    coalesce(_discord_data->>'display_name', _custom_claims->>'display_name'),
    _raw_meta
  )
  on conflict (id) do update set
    global_name = excluded.global_name,
    premium_type = excluded.premium_type,
    flags = excluded.flags,
    banner_url = excluded.banner_url,
    banner_color = excluded.banner_color,
    discriminator = excluded.discriminator,
    locale = excluded.locale,
    mfa_enabled = excluded.mfa_enabled,
    accent_color = excluded.accent_color,
    avatar_decoration = excluded.avatar_decoration,
    banner = excluded.banner,
    display_name = excluded.display_name,
    raw_metadata = excluded.raw_metadata,
    updated_at = timezone('utc'::text, now());

  return new;
end;
$$;

-- Add comment explaining the function update
comment on function public.handle_new_user is 'Handles new user registration from Discord OAuth, prioritizing discord_data over custom_claims for profile fields'; 