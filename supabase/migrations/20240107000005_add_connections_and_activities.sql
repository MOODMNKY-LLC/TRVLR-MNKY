-- Create table for Discord user connections
create table if not exists discord_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  connection_id text not null,
  connection_type text not null,
  name text not null,
  verified boolean default false,
  visibility boolean default true,
  friend_sync boolean default false,
  show_activity boolean default true,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, connection_type, connection_id)
);

-- Create table for Discord activities
create table if not exists discord_activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  activity_type integer not null,
  name text not null,
  state text,
  details text,
  application_id text,
  timestamps jsonb default '{}'::jsonb,
  assets jsonb default '{}'::jsonb,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table discord_connections enable row level security;
alter table discord_activities enable row level security;

-- RLS policies for connections
create policy "Users can view their own connections"
  on discord_connections for select
  using (auth.uid() = user_id);

create policy "Users can manage their own connections"
  on discord_connections for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- RLS policies for activities
create policy "Users can view their own activities"
  on discord_activities for select
  using (auth.uid() = user_id);

create policy "Users can manage their own activities"
  on discord_activities for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create indexes for better query performance
create index if not exists idx_discord_connections_user_id 
  on discord_connections(user_id);
create index if not exists idx_discord_connections_type 
  on discord_connections(connection_type);
create index if not exists idx_discord_activities_user_id 
  on discord_activities(user_id);
create index if not exists idx_discord_activities_type 
  on discord_activities(activity_type);

-- Update trigger for handling updated_at
create trigger handle_updated_at_connections
  before update on discord_connections
  for each row
  execute function public.handle_updated_at();

create trigger handle_updated_at_activities
  before update on discord_activities
  for each row
  execute function public.handle_updated_at(); 