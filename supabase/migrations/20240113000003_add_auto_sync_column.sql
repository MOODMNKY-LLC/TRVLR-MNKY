-- Add auto_sync column to bungie_accounts
alter table bungie_accounts 
add column auto_sync boolean default false;

-- Add an index for faster querying of accounts needing refresh
create index if not exists idx_bungie_accounts_auto_sync_expires
on bungie_accounts(auto_sync, expires_at)
where auto_sync = true; 