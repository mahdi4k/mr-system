-- Debug table for Telegram webhook payload inspection (safe, no secrets stored)
create table if not exists public.telegram_webhook_debug (
  update_id bigint primary key,
  message_id bigint,
  chat_id bigint,
  has_photo boolean,
  photo_count int,
  has_document boolean,
  has_text boolean,
  has_caption boolean,
  text_length int,
  caption_length int,
  file_id_prefix text,
  file_path text,
  download_status int,
  download_content_type text,
  download_bytes int,
  storage_error text,
  image_error text,
  raw_has_photo_key boolean,
  media_group_id text,
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='telegram_webhook_debug' and column_name='media_group_id'
  ) then
    alter table public.telegram_webhook_debug add column media_group_id text;
  end if;
end $$;

alter table public.telegram_webhook_debug enable row level security;

drop policy if exists "Service role manages debug" on public.telegram_webhook_debug;
create policy "Service role manages debug"
on public.telegram_webhook_debug for all
to authenticated
using (coalesce((select auth.role()), '') = 'service_role')
with check (coalesce((select auth.role()), '') = 'service_role');

-- Allow reading for debugging (optional, remove after fix)
drop policy if exists "Admin can read debug" on public.telegram_webhook_debug;
create policy "Admin can read debug"
on public.telegram_webhook_debug for select
to authenticated
using (coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');
