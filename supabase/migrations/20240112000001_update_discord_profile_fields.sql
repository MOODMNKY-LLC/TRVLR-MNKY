-- Add new columns to profiles table
alter table profiles add column if not exists premium_type smallint default null;
alter table profiles add column if not exists flags bigint default null;
alter table profiles add column if not exists banner_url text default null;
alter table profiles add column if not exists banner_color text default null;
alter table profiles add column if not exists discriminator text default null;
alter table profiles add column if not exists locale text default null;
alter table profiles add column if not exists mfa_enabled boolean default false;
alter table profiles add column if not exists accent_color integer default null;
alter table profiles add column if not exists avatar_decoration text default null;
alter table profiles add column if not exists banner text default null;
alter table profiles add column if not exists display_name text default null;

-- Update the handle_new_user function to include new fields
create or replace function public.handle_new_user() 
returns trigger
language plpgsql security definer
as $$
declare
  _raw_meta jsonb;
  _custom_claims jsonb;
begin
  _raw_meta := new.raw_user_meta_data;
  _custom_claims := coalesce(_raw_meta->'custom_claims', '{}'::jsonb);

  -- Insert profile data with new fields
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
    _custom_claims->>'global_name',
    (_custom_claims->>'premium_type')::smallint,
    (_custom_claims->>'flags')::bigint,
    _custom_claims->>'banner_url',
    _custom_claims->>'banner_color',
    _custom_claims->>'discriminator',
    _custom_claims->>'locale',
    (_custom_claims->>'mfa_enabled')::boolean,
    (_custom_claims->>'accent_color')::integer,
    _custom_claims->>'avatar_decoration',
    _custom_claims->>'banner',
    _custom_claims->>'display_name',
    _raw_meta
  );

  -- Sync connections if available
  if _custom_claims->'connections' is not null then
    insert into discord_connections (
      user_id,
      connection_id,
      connection_type,
      name,
      verified,
      visibility,
      friend_sync,
      show_activity,
      metadata
    )
    select 
      new.id,
      c->>'id',
      c->>'type',
      c->>'name',
      (c->>'verified')::boolean,
      (c->>'visibility')::boolean,
      (c->>'friend_sync')::boolean,
      (c->>'show_activity')::boolean,
      c
    from jsonb_array_elements(_custom_claims->'connections') as c
    on conflict (user_id, connection_type, connection_id) 
    do update set
      name = excluded.name,
      verified = excluded.verified,
      visibility = excluded.visibility,
      friend_sync = excluded.friend_sync,
      show_activity = excluded.show_activity,
      metadata = excluded.metadata,
      updated_at = timezone('utc'::text, now());
  end if;

  -- Sync current activity if available
  if _custom_claims->'presence'->'activities' is not null then
    insert into discord_activities (
      user_id,
      activity_type,
      name,
      state,
      details,
      application_id,
      timestamps,
      assets,
      metadata
    )
    select 
      new.id,
      (a->>'type')::integer,
      a->>'name',
      a->>'state',
      a->>'details',
      a->>'application_id',
      a->'timestamps',
      a->'assets',
      a
    from jsonb_array_elements(_custom_claims->'presence'->'activities') as a;
  end if;

  return new;
end;
$$;

-- Create indexes for new fields
create index if not exists profiles_premium_type_idx on profiles(premium_type);
create index if not exists profiles_flags_idx on profiles(flags);
create index if not exists profiles_discriminator_idx on profiles(discriminator);
create index if not exists profiles_locale_idx on profiles(locale);

-- Add comment to explain the table structure
comment on table profiles is 'Stores Discord user profile information including Nitro status, flags, and additional metadata';

-- Add comments for new columns
comment on column profiles.premium_type is 'Discord Nitro subscription type (0: None, 1: Classic, 2: Nitro, 3: Basic)';
comment on column profiles.flags is 'Discord user flags (bitfield)';
comment on column profiles.banner_url is 'URL of the user''s profile banner';
comment on column profiles.banner_color is 'Hex color code of the banner if no banner is set';
comment on column profiles.discriminator is 'Legacy Discord user discriminator';
comment on column profiles.locale is 'User''s selected language';
comment on column profiles.mfa_enabled is 'Whether the user has two-factor authentication enabled';
comment on column profiles.accent_color is 'User''s chosen accent color';
comment on column profiles.avatar_decoration is 'Special avatar decoration (if any)';
comment on column profiles.banner is 'Raw banner data';
comment on column profiles.display_name is 'User''s display name'; 