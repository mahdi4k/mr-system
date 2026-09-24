-- Telegram channel info for ads forwarded from Telegram
-- Stores the original channel/username so the ad page can show "from Telegram channel" instead of admin

alter table public.ads
  add column if not exists telegram_channel text,
  add column if not exists telegram_username text;

comment on column public.ads.telegram_channel is 'Telegram channel/title where the ad was forwarded from (if source is telegram)';
comment on column public.ads.telegram_username is 'First @username found in Telegram message (for direct t.me link)';
