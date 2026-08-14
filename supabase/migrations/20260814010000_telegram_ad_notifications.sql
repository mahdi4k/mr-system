alter table public.ads
  add column if not exists telegram_notification_claimed_at timestamptz,
  add column if not exists telegram_notified_at timestamptz;

create or replace function public.protect_ad_notification_fields()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if (
    new.telegram_notification_claimed_at is distinct from old.telegram_notification_claimed_at
    or new.telegram_notified_at is distinct from old.telegram_notified_at
  ) and coalesce((select auth.role()), '') <> 'service_role'
  then
    raise exception 'Advertisement notification fields are server-managed';
  end if;
  return new;
end;
$$;

drop trigger if exists ads_protect_notification_fields on public.ads;
create trigger ads_protect_notification_fields
before update on public.ads
for each row execute function public.protect_ad_notification_fields();
