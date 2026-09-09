-- ===========================================================================
-- Catalog product exclusions (admin "delete" for static catalog items)
--
-- The static catalog is defined in code (app/_data/products/*), so items
-- cannot be physically deleted from the database. Instead, an admin "delete"
-- records an exclusion row; the merged catalog (dashboard, listings, build
-- picker) filters excluded items out everywhere.
-- ===========================================================================

create table if not exists public.catalog_product_exclusions (
  part_type public.catalog_part_type not null,
  product_id integer not null check (product_id > 0),
  deleted_at timestamptz not null default now(),
  deleted_by uuid references auth.users (id) on delete set null,
  primary key (part_type, product_id)
);

alter table public.catalog_product_exclusions enable row level security;

-- Exclusions must be readable by everyone so the public catalog can filter.
drop policy if exists "Catalog exclusions are publicly readable" on public.catalog_product_exclusions;
create policy "Catalog exclusions are publicly readable"
on public.catalog_product_exclusions for select
to anon, authenticated
using (true);

-- Only administrators can delete (record exclusions) or restore (remove them).
drop policy if exists "Administrators insert catalog exclusions" on public.catalog_product_exclusions;
create policy "Administrators insert catalog exclusions"
on public.catalog_product_exclusions for insert
to authenticated
with check (coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

drop policy if exists "Administrators delete catalog exclusions" on public.catalog_product_exclusions;
create policy "Administrators delete catalog exclusions"
on public.catalog_product_exclusions for delete
to authenticated
using (coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');