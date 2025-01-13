-- Create loadouts table
create table if not exists loadouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  class_type integer not null,
  items jsonb not null,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create item annotations table (tags, notes)
create table if not exists item_annotations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  item_hash bigint not null,
  instance_id text,
  tag text,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, item_hash, instance_id)
);

-- Create user settings table
create table if not exists user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create clan settings table
create table if not exists clan_settings (
  clan_id bigint primary key,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table loadouts enable row level security;
alter table item_annotations enable row level security;
alter table user_settings enable row level security;
alter table clan_settings enable row level security;

-- RLS policies for loadouts
create policy "Users can view their own loadouts"
  on loadouts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own loadouts"
  on loadouts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own loadouts"
  on loadouts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own loadouts"
  on loadouts for delete
  using (auth.uid() = user_id);

-- RLS policies for item annotations
create policy "Users can view their own item annotations"
  on item_annotations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own item annotations"
  on item_annotations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own item annotations"
  on item_annotations for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own item annotations"
  on item_annotations for delete
  using (auth.uid() = user_id);

-- RLS policies for user settings
create policy "Users can view their own settings"
  on user_settings for select
  using (auth.uid() = user_id);

create policy "Users can insert their own settings"
  on user_settings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own settings"
  on user_settings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- RLS policies for clan settings
create policy "Anyone can view clan settings"
  on clan_settings for select
  using (true);

create policy "Only authenticated users can update clan settings"
  on clan_settings for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Create indexes
create index if not exists idx_loadouts_user_id on loadouts(user_id);
create index if not exists idx_item_annotations_user_id on item_annotations(user_id);
create index if not exists idx_item_annotations_item_hash on item_annotations(item_hash); 