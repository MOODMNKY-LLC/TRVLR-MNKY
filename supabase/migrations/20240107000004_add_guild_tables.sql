-- Create table for Discord guilds
create table if not exists discord_guilds (
  id text primary key,                      -- Discord's guild ID
  name text not null,                       -- Guild name
  icon text,                                -- Guild icon hash
  features jsonb default '[]'::jsonb,       -- Guild features array
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create table for user guild memberships
create table if not exists guild_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  guild_id text references discord_guilds(id) on delete cascade not null,
  is_owner boolean default false,           -- Whether user owns the guild
  permissions bigint not null,              -- User's guild permissions
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  
  unique(user_id, guild_id)                 -- User can only be in a guild once
);

-- Enable RLS
alter table discord_guilds enable row level security;
alter table guild_members enable row level security;

-- Guild policies
create policy "Guilds are viewable by their members"
  on discord_guilds for select
  using (
    exists (
      select 1 from guild_members
      where guild_id = discord_guilds.id
      and user_id = auth.uid()
    )
  );

-- Guild member policies
create policy "Users can view members of their guilds"
  on guild_members for select
  using (
    exists (
      select 1 from guild_members as gm
      where gm.guild_id = guild_members.guild_id
      and gm.user_id = auth.uid()
    )
  );

create policy "System can manage guild members"
  on guild_members for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- Function to sync user's guilds
create or replace function sync_user_guilds(user_id uuid, guilds jsonb)
returns void
security definer
set search_path = public
language plpgsql as $$
declare
  guild_data jsonb;
begin
  -- Loop through each guild in the array
  for guild_data in select * from jsonb_array_elements(guilds)
  loop
    -- Insert or update guild
    insert into discord_guilds (id, name, icon, features)
    values (
      guild_data->>'id',
      guild_data->>'name',
      guild_data->>'icon',
      coalesce(guild_data->'features', '[]'::jsonb)
    )
    on conflict (id) do update set
      name = excluded.name,
      icon = excluded.icon,
      features = excluded.features,
      updated_at = timezone('utc'::text, now());

    -- Insert or update guild membership
    insert into guild_members (user_id, guild_id, is_owner, permissions)
    values (
      user_id,
      guild_data->>'id',
      (guild_data->>'owner')::boolean,
      (guild_data->>'permissions')::bigint
    )
    on conflict (user_id, guild_id) do update set
      is_owner = excluded.is_owner,
      permissions = excluded.permissions,
      updated_at = timezone('utc'::text, now());
  end loop;
end;
$$;

-- Create indexes for better query performance
create index if not exists idx_guild_members_user_id on guild_members(user_id);
create index if not exists idx_guild_members_guild_id on guild_members(guild_id); 