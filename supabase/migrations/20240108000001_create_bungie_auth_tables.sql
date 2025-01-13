-- Create table for storing Bungie.net tokens
create table if not exists public.bungie_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  membership_id text not null,
  membership_type integer not null,
  access_token text not null,
  refresh_token text not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  unique(user_id)
);

-- Enable RLS
alter table public.bungie_tokens enable row level security;

-- Create RLS policies
create policy "Users can view their own Bungie tokens."
  on public.bungie_tokens for select
  using (auth.uid() = user_id);

create policy "Users can update their own Bungie tokens."
  on public.bungie_tokens for update
  using (auth.uid() = user_id);

create policy "Users can insert their own Bungie tokens."
  on public.bungie_tokens for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own Bungie tokens."
  on public.bungie_tokens for delete
  using (auth.uid() = user_id);

-- Update the moddatetime trigger to handle updated_at correctly
drop trigger if exists handle_updated_at on bungie_tokens;
create trigger handle_updated_at 
  before update on bungie_tokens
  for each row
  execute function moddatetime (updated_at);

-- Create indexes
create index bungie_tokens_user_id_idx on public.bungie_tokens(user_id);
create index bungie_tokens_membership_id_idx on public.bungie_tokens(membership_id);

-- Grant permissions
grant all on public.bungie_tokens to authenticated;
grant all on public.bungie_tokens to service_role;

-- Create table for storing Bungie accounts
create table bungie_accounts (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  access_token text not null,
  refresh_token text not null,
  expires_at timestamp with time zone not null,
  membership_id text not null,
  token_type text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id)
);

-- Add RLS policies
alter table bungie_accounts enable row level security;

create policy "Users can view their own Bungie accounts"
  on bungie_accounts for select
  using (auth.uid() = user_id);

create policy "Users can update their own Bungie accounts"
  on bungie_accounts for update
  using (auth.uid() = user_id);

create policy "Users can insert their own Bungie accounts"
  on bungie_accounts for insert
  with check (auth.uid() = user_id); 