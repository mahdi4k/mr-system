create or replace function public.protect_ad_moderation_fields()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if (select auth.uid()) = old.user_id
    and coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') <> 'admin'
  then
    if (
      new.category_id is distinct from old.category_id
      or new.city_id is distinct from old.city_id
      or new.description is distinct from old.description
      or new.price is distinct from old.price
      or new.province_id is distinct from old.province_id
      or new.title is distinct from old.title
    ) and old.status in ('published', 'rejected', 'sold')
    then
      new.status = 'pending';
      return new;
    end if;

    if new.status is distinct from old.status
      and not (
        (old.status = 'published' and new.status = 'sold')
        or (old.status in ('pending', 'published', 'rejected', 'sold') and new.status = 'archived')
        or (
          old.status in ('published', 'rejected', 'sold')
          and new.status = 'pending'
          and pg_trigger_depth() > 1
        )
      )
    then
      raise exception 'Only administrators can change advertisement moderation status';
    end if;
  end if;
  return new;
end;
$$;

create or replace function public.reset_ad_status_after_image_change()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  target_ad_id uuid;
begin
  target_ad_id = case when tg_op = 'DELETE' then old.ad_id else new.ad_id end;

  if coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') <> 'admin'
  then
    update public.ads
    set status = 'pending'
    where id = target_ad_id
      and user_id = (select auth.uid())
      and status in ('published', 'rejected', 'sold');
  end if;

  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

drop trigger if exists ad_images_reset_ad_status on public.ad_images;
create trigger ad_images_reset_ad_status
after insert or update or delete on public.ad_images
for each row execute function public.reset_ad_status_after_image_change();
