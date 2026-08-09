create extension if not exists pgcrypto;

do $$
begin
  create type public.ad_status as enum (
    'pending',
    'published',
    'sold',
    'archived',
    'rejected'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (display_name is null or char_length(display_name) between 2 and 80),
  avatar_url text,
  phone text check (phone is null or phone ~ '^0?9[0-9]{9}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.profiles (id, display_name, phone)
select
  id,
  nullif(raw_user_meta_data ->> 'display_name', ''),
  coalesce(
    nullif(raw_user_meta_data ->> 'phone', ''),
    case when phone like '+98%' then '0' || substring(phone from 4) else phone end
  )
from auth.users
on conflict (id) do nothing;

create table if not exists public.ad_categories (
  id smallint primary key,
  value text not null unique,
  name text not null,
  icon text not null,
  sort_order smallint not null default 0,
  is_active boolean not null default true
);

insert into public.ad_categories (id, value, name, icon, sort_order)
values
  (1, 'cpu', 'پردازنده (CPU)', '/svg/cpu.svg', 1),
  (2, 'graphic', 'کارت گرافیک (GPU)', '/svg/graphic.svg', 2),
  (3, 'motherboard', 'مادربرد', '/svg/motherboard.svg', 3),
  (4, 'ram', 'حافظه رم (RAM)', '/svg/ram.svg', 4),
  (5, 'power', 'منبع تغذیه (Power)', '/svg/power.svg', 5),
  (6, 'case', 'کیس (Case)', '/svg/case.svg', 6),
  (7, 'fan', 'خنک‌کننده (Cooler)', '/svg/fan.svg', 7),
  (8, 'ssd', 'حافظه SSD', '/svg/ssd.svg', 8)
on conflict (id) do update set
  value = excluded.value,
  name = excluded.name,
  icon = excluded.icon,
  sort_order = excluded.sort_order;

create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  category_id smallint not null references public.ad_categories (id),
  title text not null check (char_length(title) between 3 and 120),
  description text not null check (char_length(description) between 10 and 5000),
  price bigint check (price is null or price between 0 and 999999999999),
  province_id integer not null check (province_id > 0),
  city_id integer not null check (city_id > 0),
  status public.ad_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ad_images (
  id uuid primary key default gen_random_uuid(),
  ad_id uuid not null references public.ads (id) on delete cascade,
  storage_path text not null unique,
  url text not null,
  sort_order smallint not null default 0 check (sort_order between 0 and 2),
  created_at timestamptz not null default now(),
  unique (ad_id, sort_order)
);

create index if not exists ads_public_feed_idx
  on public.ads (status, created_at desc);
create index if not exists ads_owner_idx
  on public.ads (user_id, created_at desc);
create index if not exists ads_category_feed_idx
  on public.ads (category_id, status, created_at desc);
create index if not exists ads_province_feed_idx
  on public.ads (province_id, status, created_at desc);
create index if not exists ad_images_ad_idx
  on public.ad_images (ad_id, sort_order);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.protect_ad_moderation_fields()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.status is distinct from old.status
    and (select auth.uid()) = old.user_id
    and coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') <> 'admin'
  then
    raise exception 'Only administrators can change advertisement moderation status';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists ads_set_updated_at on public.ads;
create trigger ads_set_updated_at
before update on public.ads
for each row execute function public.set_updated_at();

drop trigger if exists ads_protect_moderation_fields on public.ads;
create trigger ads_protect_moderation_fields
before update on public.ads
for each row execute function public.protect_ad_moderation_fields();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, phone)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'display_name', ''),
    coalesce(
      nullif(new.raw_user_meta_data ->> 'phone', ''),
      case
        when new.phone like '+98%' then '0' || substring(new.phone from 4)
        else new.phone
      end
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.ad_categories enable row level security;
alter table public.ads enable row level security;
alter table public.ad_images enable row level security;

drop policy if exists "Profiles are publicly readable" on public.profiles;
drop policy if exists "Profiles are readable when publicly relevant" on public.profiles;
create policy "Profiles are readable when publicly relevant"
on public.profiles for select
to anon, authenticated
using (
  (select auth.uid()) = id
  or coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
  or exists (
    select 1 from public.ads
    where ads.user_id = profiles.id and ads.status = 'published'
  )
);

drop policy if exists "Users update their own profile" on public.profiles;
create policy "Users update their own profile"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists "Categories are publicly readable" on public.ad_categories;
create policy "Categories are publicly readable"
on public.ad_categories for select
to anon, authenticated
using (is_active);

drop policy if exists "Published ads and owner ads are readable" on public.ads;
create policy "Published ads and owner ads are readable"
on public.ads for select
to anon, authenticated
using (status = 'published' or (select auth.uid()) = user_id);

drop policy if exists "Users create their own ads" on public.ads;
create policy "Users create their own ads"
on public.ads for insert
to authenticated
with check ((select auth.uid()) = user_id and status = 'pending');

drop policy if exists "Users update their own ads" on public.ads;
create policy "Users update their own ads"
on public.ads for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users delete their own ads" on public.ads;
create policy "Users delete their own ads"
on public.ads for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Administrators read all ads" on public.ads;
create policy "Administrators read all ads"
on public.ads for select
to authenticated
using (coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

drop policy if exists "Administrators update all ads" on public.ads;
create policy "Administrators update all ads"
on public.ads for update
to authenticated
using (coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin')
with check (coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

drop policy if exists "Administrators delete all ads" on public.ads;
create policy "Administrators delete all ads"
on public.ads for delete
to authenticated
using (coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

drop policy if exists "Visible ad images are readable" on public.ad_images;
create policy "Visible ad images are readable"
on public.ad_images for select
to anon, authenticated
using (
  exists (
    select 1 from public.ads
    where ads.id = ad_images.ad_id
      and (
        ads.status = 'published'
        or ads.user_id = (select auth.uid())
        or coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
      )
  )
);

drop policy if exists "Owners create ad images" on public.ad_images;
create policy "Owners create ad images"
on public.ad_images for insert
to authenticated
with check (
  exists (
    select 1 from public.ads
    where ads.id = ad_images.ad_id
      and ads.user_id = (select auth.uid())
  )
);

drop policy if exists "Owners update ad images" on public.ad_images;
create policy "Owners update ad images"
on public.ad_images for update
to authenticated
using (
  exists (
    select 1 from public.ads
    where ads.id = ad_images.ad_id
      and ads.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.ads
    where ads.id = ad_images.ad_id
      and ads.user_id = (select auth.uid())
  )
);

drop policy if exists "Owners delete ad images" on public.ad_images;
create policy "Owners delete ad images"
on public.ad_images for delete
to authenticated
using (
  exists (
    select 1 from public.ads
    where ads.id = ad_images.ad_id
      and ads.user_id = (select auth.uid())
  )
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'ad-images',
  'ad-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users upload ad images to their folder" on storage.objects;
create policy "Users upload ad images to their folder"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'ad-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1 from public.ads
    where ads.id::text = (storage.foldername(name))[2]
      and ads.user_id = (select auth.uid())
  )
);

drop policy if exists "Users update ad images in their folder" on storage.objects;
create policy "Users update ad images in their folder"
on storage.objects for update
to authenticated
using (
  bucket_id = 'ad-images'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
  )
)
with check (
  bucket_id = 'ad-images'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
  )
);

drop policy if exists "Users delete ad images in their folder" on storage.objects;
create policy "Users delete ad images in their folder"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'ad-images'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
  )
);
