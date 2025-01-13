-- Create manifest version tracking table
create table if not exists manifest_versions (
  id bigint generated always as identity primary key,
  version text not null unique,
  is_current boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on manifest_versions
alter table manifest_versions enable row level security;

-- Create RLS policies for manifest_versions
create policy "Allow public read access to manifest_versions"
  on manifest_versions
  for select
  to authenticated, anon
  using (true);

create policy "Allow service role to manage manifest_versions"
  on manifest_versions
  for all
  to service_role
  using (true)
  with check (true);

-- Create base tables for Destiny 2 manifest components
create table if not exists destinyinventoryitemdefinition (
  id bigint primary key,
  version_id bigint references manifest_versions(id),
  hash bigint not null,
  name text,
  description text,
  icon text,
  json_data jsonb not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists destinyactivitydefinition (
  id bigint primary key,
  version_id bigint references manifest_versions(id),
  hash bigint not null,
  name text,
  description text,
  icon text,
  json_data jsonb not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists destinyclassdefinition (
  id bigint primary key,
  version_id bigint references manifest_versions(id),
  hash bigint not null,
  name text,
  description text,
  icon text,
  json_data jsonb not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists destinydamagetypedefinition (
  id bigint primary key,
  version_id bigint references manifest_versions(id),
  hash bigint not null,
  name text,
  description text,
  icon text,
  json_data jsonb not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists destinystatdefinition (
  id bigint primary key,
  version_id bigint references manifest_versions(id),
  hash bigint not null,
  name text,
  description text,
  icon text,
  json_data jsonb not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on all definition tables
alter table destinyinventoryitemdefinition enable row level security;
alter table destinyactivitydefinition enable row level security;
alter table destinyclassdefinition enable row level security;
alter table destinydamagetypedefinition enable row level security;
alter table destinystatdefinition enable row level security;

-- Create RLS policies for all definition tables
create policy "Allow public read access to destinyinventoryitemdefinition"
  on destinyinventoryitemdefinition
  for select
  to authenticated, anon
  using (true);

create policy "Allow public read access to destinyactivitydefinition"
  on destinyactivitydefinition
  for select
  to authenticated, anon
  using (true);

create policy "Allow public read access to destinyclassdefinition"
  on destinyclassdefinition
  for select
  to authenticated, anon
  using (true);

create policy "Allow public read access to destinydamagetypedefinition"
  on destinydamagetypedefinition
  for select
  to authenticated, anon
  using (true);

create policy "Allow public read access to destinystatdefinition"
  on destinystatdefinition
  for select
  to authenticated, anon
  using (true);

-- Create indexes for better query performance
create index if not exists idx_destinyinventoryitemdefinition_hash on destinyinventoryitemdefinition(hash);
create index if not exists idx_destinyinventoryitemdefinition_name on destinyinventoryitemdefinition(name);
create index if not exists idx_destinyinventoryitemdefinition_version on destinyinventoryitemdefinition(version_id);

create index if not exists idx_destinyactivitydefinition_hash on destinyactivitydefinition(hash);
create index if not exists idx_destinyactivitydefinition_name on destinyactivitydefinition(name);
create index if not exists idx_destinyactivitydefinition_version on destinyactivitydefinition(version_id);

create index if not exists idx_destinyclassdefinition_hash on destinyclassdefinition(hash);
create index if not exists idx_destinyclassdefinition_name on destinyclassdefinition(name);
create index if not exists idx_destinyclassdefinition_version on destinyclassdefinition(version_id);

create index if not exists idx_destinydamagetypedefinition_hash on destinydamagetypedefinition(hash);
create index if not exists idx_destinydamagetypedefinition_name on destinydamagetypedefinition(name);
create index if not exists idx_destinydamagetypedefinition_version on destinydamagetypedefinition(version_id);

create index if not exists idx_destinystatdefinition_hash on destinystatdefinition(hash);
create index if not exists idx_destinystatdefinition_name on destinystatdefinition(name);
create index if not exists idx_destinystatdefinition_version on destinystatdefinition(version_id); 