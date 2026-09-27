-- Admin user management: mirror the GoTrue account fields onto public.profiles so
-- the admin dashboard can search, filter, paginate and moderate users with a single
-- PostgREST query instead of paging through auth.admin.listUsers().
--
-- auth.users stays the single source of truth:
--   * role  -> auth.users.app_metadata.role (read by the dashboard layout/proxy guards)
--   * email -> auth.users.email
--   * ban   -> auth.users.banned_until
-- public.profiles only mirrors them, always through this trigger.

alter table public.profiles
  add column if not exists email text,
  add column if not exists role text not null default 'user',
  add column if not exists banned_until timestamptz,
  add column if not exists ban_reason text,
  add column if not exists last_sign_in_at timestamptz;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_role_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_role_check
      check (role in ('user', 'admin'));
  end if;
end $$;

create index if not exists profiles_created_at_idx
  on public.profiles (created_at desc);
create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists profiles_email_lower_idx
  on public.profiles (lower(email));

-- Mirror every GoTrue account change onto the matching profile row. Reads the extra
-- auth columns through to_jsonb so the function keeps working on projects whose
-- auth schema does not expose them.
create or replace function public.sync_auth_user_to_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
  set
    email = new.email,
    role = case
      when new.raw_app_meta_data ->> 'role' = 'admin' then 'admin'
      else 'user'
    end,
    banned_until = (to_jsonb(new) ->> 'banned_until')::timestamptz,
    last_sign_in_at = new.last_sign_in_at
  where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
after insert or update on auth.users
for each row execute function public.sync_auth_user_to_profile();

-- Backfill existing accounts and make sure no profile is left without a role.
insert into public.profiles (id, email, role, banned_until, last_sign_in_at)
select
  users.id,
  users.email,
  case when users.raw_app_meta_data ->> 'role' = 'admin' then 'admin' else 'user' end,
  (to_jsonb(users) ->> 'banned_until')::timestamptz,
  users.last_sign_in_at
from auth.users as users
on conflict (id) do update
set
  email = excluded.email,
  role = excluded.role,
  banned_until = excluded.banned_until,
  last_sign_in_at = excluded.last_sign_in_at;

update public.profiles set role = 'user' where role is null;

-- Defence in depth: the admin dashboard writes profiles through a server-only
-- secret-key client, but keep RLS honest for any direct client call. Reading every
-- profile is already granted to admins by the initial migration's select policy.
drop policy if exists "Administrators update all profiles" on public.profiles;
create policy "Administrators update all profiles"
on public.profiles for update
to authenticated
using (coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin')
with check (coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

-- Per-user activity counters for the admin list. Counting inside one function keeps
-- the dashboard query at a single round trip instead of four count queries.
create or replace function public.admin_user_stats(user_ids uuid[])
returns table (
  user_id uuid,
  ads_count bigint,
  articles_count bigint,
  conversations_count bigint,
  saved_systems_count bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    profiles.id as user_id,
    (
      select count(*) from public.ads
      where ads.user_id = profiles.id
    ) as ads_count,
    (
      select count(*) from public.articles
      where articles.author_id = profiles.id
    ) as articles_count,
    (
      select count(*) from public.conversations
      where conversations.buyer_id = profiles.id
         or conversations.seller_id = profiles.id
    ) as conversations_count,
    (
      select count(*) from public.saved_systems
      where saved_systems.user_id = profiles.id
    ) as saved_systems_count
  from public.profiles as profiles
  where profiles.id = any (user_ids);
$$;

revoke all on function public.admin_user_stats(uuid[]) from public, anon, authenticated;
grant execute on function public.admin_user_stats(uuid[]) to service_role;
