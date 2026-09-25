alter table public.ads
  add column if not exists telegram_channel_username text;

comment on column public.ads.telegram_channel_username is 'Telegram channel username (without @) for https://t.me/<username> link, e.g. pcrazor_ad';
