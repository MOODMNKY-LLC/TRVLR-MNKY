-- Add bungie_profile column to bungie_accounts
alter table bungie_accounts 
add column if not exists bungie_profile jsonb; 