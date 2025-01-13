-- Create function to execute dynamic SQL (restricted to service_role)
create or replace function exec_sql(sql text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  execute sql;
end;
$$;

-- Grant execute permission only to service role
revoke all on function exec_sql(text) from public;
grant execute on function exec_sql(text) to service_role; 