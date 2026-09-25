-- Saved systems: users can save a build configuration like cpu=3&motherboard=8&ram=1&graphic=2&power=1&ssd=2&case=21&fan=2&ramQuantity=2

create table if not exists public.saved_systems (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null check (char_length(name) between 2 and 50),
  config jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists saved_systems_user_idx on public.saved_systems (user_id, created_at desc);

-- updated_at trigger
drop trigger if exists saved_systems_set_updated_at on public.saved_systems;
create trigger saved_systems_set_updated_at
before update on public.saved_systems
for each row execute function public.set_updated_at();

alter table public.saved_systems enable row level security;

drop policy if exists "Users manage own saved systems" on public.saved_systems;
create policy "Users manage own saved systems"
on public.saved_systems for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

-- Allow service_role to bypass for admin if needed (already bypasses RLS)
