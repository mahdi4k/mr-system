do $$
begin
  create type public.article_status as enum ('draft', 'published', 'archived');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete restrict,
  title text not null check (char_length(title) between 5 and 180),
  slug text not null unique check (
    char_length(slug) between 3 and 180
    and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  ),
  excerpt text not null check (char_length(excerpt) between 20 and 500),
  content text not null check (char_length(content) between 50 and 50000),
  category_name text not null check (char_length(category_name) between 2 and 80),
  category_slug text not null check (
    char_length(category_slug) between 2 and 80
    and category_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  ),
  featured_image_url text,
  featured_image_path text unique,
  status public.article_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint articles_published_at_check check (
    status <> 'published' or published_at is not null
  )
);

create index if not exists articles_public_idx
  on public.articles (status, published_at desc);
create index if not exists articles_category_idx
  on public.articles (category_slug, status, published_at desc);

drop trigger if exists articles_set_updated_at on public.articles;
create trigger articles_set_updated_at
before update on public.articles
for each row execute function public.set_updated_at();

create or replace function public.set_article_publication_date()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.status = 'published' and new.published_at is null then
    new.published_at = now();
  elsif new.status <> 'published' then
    new.published_at = null;
  end if;
  return new;
end;
$$;

drop trigger if exists articles_set_publication_date on public.articles;
create trigger articles_set_publication_date
before insert or update on public.articles
for each row execute function public.set_article_publication_date();

alter table public.articles enable row level security;
grant select on table public.articles to anon, authenticated;
grant insert, update, delete on table public.articles to authenticated;

drop policy if exists "Published articles are publicly readable" on public.articles;
create policy "Published articles are publicly readable"
on public.articles for select
to anon, authenticated
using (
  status = 'published'
  or coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
);

drop policy if exists "Administrators create articles" on public.articles;
create policy "Administrators create articles"
on public.articles for insert
to authenticated
with check (
  author_id = (select auth.uid())
  and coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
);

drop policy if exists "Administrators update articles" on public.articles;
create policy "Administrators update articles"
on public.articles for update
to authenticated
using (coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin')
with check (coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

drop policy if exists "Administrators delete articles" on public.articles;
create policy "Administrators delete articles"
on public.articles for delete
to authenticated
using (coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'article-images',
  'article-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Administrators upload article images" on storage.objects;
create policy "Administrators upload article images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'article-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
);

drop policy if exists "Administrators update article images" on storage.objects;
create policy "Administrators update article images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'article-images'
  and coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
)
with check (
  bucket_id = 'article-images'
  and coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
);

drop policy if exists "Administrators delete article images" on storage.objects;
create policy "Administrators delete article images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'article-images'
  and coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
);
