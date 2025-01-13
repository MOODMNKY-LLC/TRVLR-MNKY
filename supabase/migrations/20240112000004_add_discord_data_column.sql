-- Add discord_data column to profiles table
alter table public.profiles
  add column if not exists discord_data jsonb;

-- Add comment explaining the column
comment on column public.profiles.discord_data is 'Complete Discord user data from the OAuth response'; 