-- ============================================================================
-- Rigora production catalog + Torob price/image sync (via Parse.bot)
--
-- This migration establishes:
--   * catalog_product_content  -> authoritative editable title, price, image, and
--                                 price-synchronization state (claim/lease metadata)
--   * price_history            -> automatic market price history (server-side only)
--   * catalog_audit_history    -> immutable audit trail for ADMIN manual edits
--   * torob_match_candidates   -> reviewable Torob match candidates (admin confirms)
--   * product-images storage bucket
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Enumerations / allowed part types
-- ---------------------------------------------------------------------------
do $$
begin
  create type public.catalog_part_type as enum (
    'cpu', 'motherboard', 'graphic', 'power', 'ram', 'fan', 'ssd', 'case'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.catalog_sync_status as enum (
    'active', 'failed', 'retrying', 'never'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.price_source as enum ('automatic', 'manual');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.match_status as enum ('pending', 'approved', 'rejected');
exception
  when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- 2. catalog_product_content
-- ---------------------------------------------------------------------------
create table if not exists public.catalog_product_content (
  part_type public.catalog_part_type not null,
  product_id integer not null check (product_id > 0),
  title text not null check (char_length(title) between 1 and 250),

  -- Editable / synchronized market data
  current_price bigint check (current_price is null or current_price between 1 and 999999999999),
  price_source public.price_source default 'automatic',
  image_url text,
  torob_product_id text,

  -- Price synchronization state
  sync_status public.catalog_sync_status not null default 'never',
  fetched_at timestamptz,
  next_fetch_at timestamptz,
  last_success_at timestamptz,
  last_error text,
  failure_count integer not null default 0 check (failure_count >= 0),

  -- Claim / lease mechanism for the price worker (no long DB locks during HTTP)
  claimed_at timestamptz,
  lease_until timestamptz,
  claim_token uuid,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  primary key (part_type, product_id)
);

-- Worker lookup: products due for refresh.
create index if not exists catalog_sync_due_idx
  on public.catalog_product_content (next_fetch_at)
  where next_fetch_at is not null;

-- Worker claim recovery: expired leases can be reclaimed.
create index if not exists catalog_lease_idx
  on public.catalog_product_content (lease_until)
  where lease_until is not null;

-- Confirmed Torob references.
create index if not exists catalog_torob_product_idx
  on public.catalog_product_content (torob_product_id)
  where torob_product_id is not null;

drop trigger if exists catalog_product_content_set_updated_at on public.catalog_product_content;
create trigger catalog_product_content_set_updated_at
  before update on public.catalog_product_content
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 3. price_history (automatic synchronization history)
-- ---------------------------------------------------------------------------
create table if not exists public.price_history (
  id bigint generated always as identity primary key,
  part_type public.catalog_part_type not null,
  product_id integer not null,
  provider text not null default 'torob',
  price bigint not null check (price between 1 and 999999999999),
  recorded_at timestamptz not null default now()
);

create index if not exists price_history_product_idx
  on public.price_history (part_type, product_id, recorded_at desc);

-- ---------------------------------------------------------------------------
-- 4. catalog_audit_history (immutable admin edit trail)
-- ---------------------------------------------------------------------------
create table if not exists public.catalog_audit_history (
  id bigint generated always as identity primary key,
  part_type public.catalog_part_type not null,
  product_id integer not null,
  action text not null check (action in ('insert', 'update', 'delete')),
  title_before text,
  title_after text,
  price_before bigint,
  price_after bigint,
  changed_by uuid,
  changed_at timestamptz not null default now()
);

create index if not exists catalog_audit_product_idx
  on public.catalog_audit_history (part_type, product_id, changed_at desc);

-- ---------------------------------------------------------------------------
-- 5. torob_match_candidates (reviewable matching)
-- ---------------------------------------------------------------------------
create table if not exists public.torob_match_candidates (
  id uuid primary key default gen_random_uuid(),
  part_type public.catalog_part_type not null,
  product_id integer not null,
  candidate_torob_product_id text not null,
  candidate_name text not null,
  candidate_price bigint,
  candidate_image_url text,
  search_query text not null,
  rank integer not null check (rank >= 0),
  status public.match_status not null default 'pending',
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid
);

create index if not exists torob_match_pending_idx
  on public.torob_match_candidates (part_type, product_id, status, rank);

-- ---------------------------------------------------------------------------
-- 6. Audit trigger for ADMIN manual edits.
--
-- The price worker uses the service-role client, which has no session JWT, so
-- auth.uid() is NULL there. We therefore audit ONLY edits made through an
-- authenticated (admin) session. Automatic worker price updates instead land
-- in price_history and never pollute the admin audit trail.
-- ---------------------------------------------------------------------------
create or replace function public.audit_catalog_content()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    return coalesce(new, old);
  end if;

  if tg_op = 'INSERT' then
    insert into public.catalog_audit_history
      (part_type, product_id, action, title_before, title_after, price_before, price_after, changed_by)
    values
      (new.part_type, new.product_id, 'insert', null, new.title, null, new.current_price, uid);
  elsif tg_op = 'UPDATE' then
    if new.title is distinct from old.title
       or new.current_price is distinct from old.current_price
    then
      insert into public.catalog_audit_history
        (part_type, product_id, action, title_before, title_after, price_before, price_after, changed_by)
      values
        (new.part_type, new.product_id, 'update', old.title, new.title, old.current_price, new.current_price, uid);
    end if;
  elsif tg_op = 'DELETE' then
    insert into public.catalog_audit_history
      (part_type, product_id, action, title_before, title_after, price_before, price_after, changed_by)
    values
      (old.part_type, old.product_id, 'delete', old.title, null, old.current_price, null, uid);
  end if;

  return coalesce(new, old);
end;
$$;

drop trigger if exists catalog_audit_trigger on public.catalog_product_content;
create trigger catalog_audit_trigger
  after insert or update or delete on public.catalog_product_content
  for each row execute function public.audit_catalog_content();

-- ---------------------------------------------------------------------------
-- 7. Row Level Security
-- ---------------------------------------------------------------------------
alter table public.catalog_product_content enable row level security;
alter table public.price_history enable row level security;
alter table public.catalog_audit_history enable row level security;
alter table public.torob_match_candidates enable row level security;

grant select on public.catalog_product_content to anon, authenticated;
grant insert, update, delete on public.catalog_product_content to authenticated;

grant select on public.price_history to anon, authenticated;
grant insert on public.price_history to authenticated;

grant select on public.catalog_audit_history to authenticated;

grant select, insert, update, delete on public.torob_match_candidates to authenticated;

-- Public catalog reads: anonymous and authenticated.
drop policy if exists "Catalog content is publicly readable" on public.catalog_product_content;
create policy "Catalog content is publicly readable"
on public.catalog_product_content for select
to anon, authenticated
using (true);

-- Only administrators can mutate catalog content.
drop policy if exists "Administrators insert catalog content" on public.catalog_product_content;
create policy "Administrators insert catalog content"
on public.catalog_product_content for insert
to authenticated
with check (coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

drop policy if exists "Administrators update catalog content" on public.catalog_product_content;
create policy "Administrators update catalog content"
on public.catalog_product_content for update
to authenticated
using (coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin')
with check (coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

drop policy if exists "Administrators delete catalog content" on public.catalog_product_content;
create policy "Administrators delete catalog content"
on public.catalog_product_content for delete
to authenticated
using (coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

-- Price history: publicly readable, admin can record.
drop policy if exists "Price history is publicly readable" on public.price_history;
create policy "Price history is publicly readable"
on public.price_history for select
to anon, authenticated
using (true);

drop policy if exists "Administrators record price history" on public.price_history;
create policy "Administrators record price history"
on public.price_history for insert
to authenticated
with check (coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

-- Audit history: admin only (public price history already covers market data).
drop policy if exists "Administrators read audit history" on public.catalog_audit_history;
create policy "Administrators read audit history"
on public.catalog_audit_history for select
to authenticated
using (coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

-- Match candidates: admin only.
drop policy if exists "Administrators read match candidates" on public.torob_match_candidates;
create policy "Administrators read match candidates"
on public.torob_match_candidates for select
to authenticated
using (coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

drop policy if exists "Administrators write match candidates" on public.torob_match_candidates;
create policy "Administrators write match candidates"
on public.torob_match_candidates for insert
to authenticated
with check (coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

drop policy if exists "Administrators update match candidates" on public.torob_match_candidates;
create policy "Administrators update match candidates"
on public.torob_match_candidates for update
to authenticated
using (coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin')
with check (coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

-- ---------------------------------------------------------------------------
-- 8. Product image storage bucket (Rigora-owned permanent images)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Administrators upload product images" on storage.objects;
create policy "Administrators upload product images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
);

drop policy if exists "Administrators update product images" on storage.objects;
create policy "Administrators update product images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'product-images'
  and coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
)
with check (
  bucket_id = 'product-images'
  and coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
);

drop policy if exists "Administrators delete product images" on storage.objects;
create policy "Administrators delete product images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'product-images'
  and coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
);

-- ---------------------------------------------------------------------------
-- 9. Seed the catalog with static fallback titles (prices intentionally NULL).
-- ---------------------------------------------------------------------------
-- Seed the Rigora product catalog with static fallback titles (prices intentionally NULL).
-- Prices are filled by the Parse.bot synchronization worker or manual admin override.
insert into public.catalog_product_content (part_type, product_id, title)
values
  ('cpu', 1, 'Intel Core i3-12100F'),
  ('cpu', 2, 'Intel Core i5-14400F'),
  ('cpu', 3, 'Intel Core i5-12400F'),
  ('cpu', 4, 'Intel Core i7-7700'),
  ('cpu', 5, 'Intel Core Ultra 5 245K'),
  ('cpu', 6, 'Intel Core i5-9400F'),
  ('cpu', 7, 'Intel Core Ultra 5 225F'),
  ('cpu', 8, 'Intel Core Ultra 9 285K'),
  ('cpu', 9, 'Intel Core i3-13100F'),
  ('cpu', 10, 'Intel Core i3-14100F'),
  ('cpu', 11, 'Intel Core i5-10400F'),
  ('cpu', 12, 'Intel Core i5-4590'),
  ('motherboard', 1, 'ASUS Prime H610M-K D4'),
  ('motherboard', 2, 'ASUS Prime B760-Plus D4'),
  ('motherboard', 3, 'Gigabyte H310M S2H DDR4'),
  ('motherboard', 4, 'ASUS Prime Z790-P DDR5'),
  ('motherboard', 5, 'ASUS H81M-C DDR3'),
  ('motherboard', 6, 'ASUS H110M-K DDR4'),
  ('motherboard', 7, 'Gigabyte H410M-S2H V2 DDR4'),
  ('motherboard', 8, 'ASUS Prime B660-Plus D4'),
  ('motherboard', 9, 'ASUS ROG Strix B860-F Gaming WiFi DDR5'),
  ('motherboard', 10, 'Gigabyte B860M E DDR5'),
  ('graphic', 1, 'ASUS Dual GeForce RTX 5050 OC 8GB'),
  ('graphic', 2, 'ASUS Prime GeForce RTX 5060 OC 8GB'),
  ('graphic', 3, 'XFX Radeon RX 580 8GB'),
  ('graphic', 4, 'ASUS Dual GeForce RTX 5070 OC 12GB'),
  ('graphic', 5, 'ASUS Prime Radeon RX 9070 XT OC 16GB'),
  ('graphic', 6, 'Palit GeForce RTX 2060 Super Dual 8GB'),
  ('graphic', 7, 'ASUS Dual GeForce RTX 4060 Ti OC 8GB'),
  ('graphic', 8, 'ASUS TUF Gaming GeForce RTX 5080 OC 16GB'),
  ('graphic', 9, 'XFX Radeon RX 5600 XT THICC II Pro 6GB'),
  ('graphic', 10, 'XFX Radeon RX 5700 XT 8GB'),
  ('power', 1, 'DeepCool PL650D 650W'),
  ('power', 2, 'DeepCool PQ750G 750W'),
  ('power', 3, 'MSI MAG A650BN 650W'),
  ('power', 4, 'Green GP500A-ECO Rev 3.1 500W'),
  ('power', 5, 'Green GP330A 330W Stock'),
  ('power', 6, 'Nova NP-300 300W'),
  ('power', 7, 'Great Wall GW-EPS1650DA 1650W'),
  ('power', 8, 'DeepCool PQ850G 850W'),
  ('power', 9, 'MSI MAG A850GL PCIE5 850W'),
  ('power', 10, 'Great Wall GW-EPS2000BL 2000W Stock'),
  ('power', 11, 'ASUS ROG Strix 1000W Platinum White'),
  ('power', 12, 'Green GP530AB 530W'),
  ('power', 13, 'Green GP580B 580W'),
  ('power', 14, 'DeepCool PF700X 700W'),
  ('power', 15, 'DeepCool PN1000D 1000W'),
  ('power', 16, 'Green GP550A-ECO Rev 3.1 550W'),
  ('power', 17, 'Green GP700A-GED 700W'),
  ('power', 18, 'MSI MAG A500DN 500W'),
  ('power', 19, 'DeepCool PL750D 750W'),
  ('power', 20, 'Thermaltake Toughpower GF1 ARGB 750W'),
  ('ram', 1, 'Crucial CT16 16GB DDR4-3200 CL22'),
  ('ram', 2, 'Crucial CT8 8GB DDR5-4800 CL40'),
  ('ram', 3, 'Crucial CT32 32GB DDR5-5600 CL46'),
  ('ram', 4, 'Kingston KVR 8GB DDR3-1600 CL11'),
  ('fan', 1, 'DeepCool AG200'),
  ('fan', 2, 'DeepCool AG400'),
  ('fan', 3, 'DeepCool AG400 BK ARGB'),
  ('fan', 4, 'UCTECH A700 RGB'),
  ('fan', 5, 'DeepCool Assassin IV'),
  ('fan', 6, 'DeepCool AG400 LED'),
  ('fan', 7, 'Green NOTUS 95-ARGB'),
  ('fan', 8, 'TSCO GAFan 230 VAYU'),
  ('fan', 9, 'AWEST GT-AV1226 ARGB'),
  ('fan', 10, 'DeepCool AG400 ARGB'),
  ('fan', 11, 'Green TinyCool 90 Rev. 1.1'),
  ('fan', 12, 'Master Tech NOVA 200 ARGB'),
  ('fan', 13, 'AWEST GT-AV903 ARGB'),
  ('fan', 14, 'Intel LGA775 Stock Cooler'),
  ('fan', 15, 'Redragon CC-2312 RGB'),
  ('fan', 16, 'Intel LGA1151 Stock Cooler'),
  ('fan', 17, 'AWEST GT-AV1201 ARGB'),
  ('fan', 18, 'AWEST GT-AV1236 ARGB'),
  ('fan', 19, 'Intel LGA1700 Stock Cooler'),
  ('fan', 20, 'Green NOTUS 95-PWM'),
  ('ssd', 1, 'Lexar NS100 256GB'),
  ('ssd', 2, 'Lexar NQ780 1TB NVMe'),
  ('ssd', 3, 'Samsung 970 PRO 1TB NVMe'),
  ('ssd', 4, 'Lexar NM610 Pro 1TB NVMe'),
  ('ssd', 5, 'Samsung 870 EVO 500GB'),
  ('ssd', 6, 'Western Digital Green 480GB'),
  ('ssd', 7, 'Samsung 990 PRO 1TB NVMe'),
  ('ssd', 8, 'Western Digital Blue SN5000 1TB NVMe'),
  ('ssd', 9, 'Lexar NS100 512GB'),
  ('ssd', 10, 'Samsung 990 PRO 2TB NVMe'),
  ('ssd', 11, 'Samsung 870 EVO 1TB'),
  ('ssd', 12, 'Western Digital Blue SN5100 1TB NVMe'),
  ('ssd', 13, 'MSI SPATIUM M450 1TB NVMe'),
  ('ssd', 14, 'Lexar NM620 1TB NVMe'),
  ('ssd', 15, 'Lexar NS100 128GB'),
  ('ssd', 16, 'Samsung 980 PRO 1TB NVMe'),
  ('ssd', 17, 'Western Digital Black SN850 1TB NVMe'),
  ('ssd', 18, 'Western Digital Green 240GB'),
  ('ssd', 19, 'Lexar NM620 512GB NVMe'),
  ('ssd', 20, 'MSI SPATIUM M450 500GB NVMe'),
  ('ssd', 21, 'Western Digital Green 1TB'),
  ('ssd', 22, 'Western Digital Blue SA510 1TB'),
  ('ssd', 23, 'MSI SPATIUM M371 1TB NVMe'),
  ('ssd', 24, 'Hiksemi Wave S 256GB'),
  ('case', 1, 'Green Homa Mid Tower Gray'),
  ('case', 2, 'AWEST AQ15-TG RGB Mid Tower Black'),
  ('case', 3, 'Thermaltake View 71 Tempered Glass'),
  ('case', 4, 'Sabet CG-35 RGB Mid Tower White'),
  ('case', 5, 'TSCO TC 4484 RGB Mid Tower Black'),
  ('case', 6, 'Twisted Minds Spider 03 ARGB Mid Tower Black'),
  ('case', 7, 'AWEST GT-AQ18-MB RGB Mid Tower Black'),
  ('case', 8, 'Sabet CG-35 RGB Mid Tower Black'),
  ('case', 9, 'DarkFlash B275 ARGB Mid Tower Black'),
  ('case', 10, 'MSI MAG FORGE M100L with 500W PSU'),
  ('case', 11, 'Overclock LW204 Tempered Glass'),
  ('case', 12, 'Redragon Wideload Pro CA-604'),
  ('case', 13, 'TSCO TC 4483 Mid Tower Black'),
  ('case', 14, 'Redragon Deflect CA-609 ARGB Mid Tower Black'),
  ('case', 15, 'GameMax Infinity Pro ARGB Mid Tower Black'),
  ('case', 16, 'Gamdias Aura GC107 Elite ARGB Mid Tower Black'),
  ('case', 17, 'Lian Li Vector V100R ARGB Mid Tower Black'),
  ('case', 18, 'TSCO GC 4492 ARGB Mid Tower Black'),
  ('case', 19, 'Gamdias Aura GC102M ARGB Micro Tower Black'),
  ('case', 20, 'AWEST GT-AQ12-MB Mid Tower Black'),
  ('case', 21, 'MSI MAG FORGE 120A Airflow ARGB Mid Tower Black'),
  ('case', 22, 'Gamdias Aura GC101M ARGB Micro Tower Black'),
  ('case', 23, 'TSCO GC 4488 Mid Tower Black'),
  ('case', 24, 'AWEST GT-AV02-BG ARGB Mid Tower Black')
on conflict (part_type, product_id) do update set
  title = excluded.title;
