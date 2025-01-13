-- Create a table for public profiles
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  -- Core Discord OAuth fields
  discord_id text unique,                    -- Discord user ID (sub)
  name text,                                -- Discord username with discriminator
  email text,                               -- User's email
  email_verified boolean default false,     -- Email verification status
  phone_verified boolean default false,     -- Phone verification status
  picture text,                            -- Discord avatar URL (CDN)
  avatar_url text,                         -- Alternate avatar URL format
  full_name text,                          -- Discord username without discriminator
  provider_id text,                        -- Discord user ID (duplicate for compatibility)
  global_name text,                        -- Discord global display name
  raw_metadata jsonb,                      -- Store complete OAuth metadata
  last_seen timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),

  constraint username_length check (char_length(full_name) >= 2)
);

-- Set up Row Level Security (RLS)
alter table profiles
  enable row level security;

-- Set up RLS policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using (true);

create policy "Users can insert their own profile."
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile."
  on profiles for update
  using (auth.uid() = id);

-- Function to handle new user creation with Discord data
create or replace function public.handle_new_user()
returns trigger
security definer
set search_path = public
language plpgsql as $$
begin
  -- Insert profile data
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
    raw_metadata
  )
  values (
    new.id,
    new.raw_user_meta_data->>'sub',
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'email',
    (new.raw_user_meta_data->>'email_verified')::boolean,
    (new.raw_user_meta_data->>'phone_verified')::boolean,
    new.raw_user_meta_data->>'picture',
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'provider_id',
    new.raw_user_meta_data->'custom_claims'->>'global_name',
    new.raw_user_meta_data
  );

  -- Sync connections if available
  if new.raw_user_meta_data->'connections' is not null then
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
      c->'metadata'
    from jsonb_array_elements(new.raw_user_meta_data->'connections') as c
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
  if new.raw_user_meta_data->'presence'->'activities' is not null then
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
    from jsonb_array_elements(new.raw_user_meta_data->'presence'->'activities') as a;
  end if;

  return new;
end;
$$;

-- Set up trigger for profile creation on user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger
security definer
language plpgsql as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Set up trigger for updating timestamp
create trigger on_profile_updated
  before update on profiles
  for each row execute procedure public.handle_updated_at();

-- Set up Storage for profile assets
insert into storage.buckets (id, name, public)
  values ('profiles', 'profiles', true)
  on conflict do nothing;

-- Set up access controls for storage
create policy "Profile images are publicly accessible."
  on storage.objects for select
  using (bucket_id = 'profiles');

create policy "Users can upload their own profile images."
  on storage.objects for insert
  with check (
    bucket_id = 'profiles' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update their own profile images."
  on storage.objects for update
  using (
    bucket_id = 'profiles' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create indexes for better query performance
create index if not exists profiles_discord_id_idx on profiles(discord_id);
create index if not exists profiles_provider_id_idx on profiles(provider_id);
create index if not exists profiles_name_idx on profiles(name); 