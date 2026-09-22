-- ===========================================================================
-- Telegram inbound webhook idempotency
--
-- Stores processed Telegram update_ids to avoid duplicate ad creation on
-- webhook retries. Webhook is server-only (admin client via SUPABASE_SECRET_KEY)
-- so RLS is not exposed to anon; table is still RLS-protected for safety.
-- ===========================================================================

create table if not exists public.telegram_webhook_events (
  update_id bigint primary key,
  message_id bigint,
  chat_id bigint,
  ad_id uuid references public.ads (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.telegram_webhook_events enable row level security;

drop policy if exists "Service role manages webhook events" on public.telegram_webhook_events;
create policy "Service role manages webhook events"
on public.telegram_webhook_events for all
to authenticated
using (coalesce((select auth.role()), '') = 'service_role')
with check (coalesce((select auth.role()), '') = 'service_role');

-- Optional provenance: track that an ad came from Telegram without altering core ads table
-- Ads created via webhook use admin client with status='pending' and are indistinguishable
-- in app code; this column is informational and nullable.
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='ads' and column_name='source'
  ) then
    alter table public.ads add column source text;
  end if;
end $$;
