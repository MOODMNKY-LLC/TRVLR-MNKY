-- Add delete policy for bungie_accounts
create policy "Users can delete their own Bungie accounts"
  on bungie_accounts for delete
  using (auth.uid() = user_id); 