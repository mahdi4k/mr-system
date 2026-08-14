create or replace function public.update_owned_ad(
  p_ad_id uuid,
  p_category_id smallint,
  p_city_id integer,
  p_description text,
  p_price bigint,
  p_province_id integer,
  p_title text,
  p_images jsonb default null
)
returns text[]
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  removed_storage_paths text[] := array[]::text[];
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  perform 1
  from public.ads
  where id = p_ad_id
    and user_id = current_user_id
  for update;

  if not found then
    raise exception 'Advertisement not found';
  end if;

  if p_images is not null then
    if jsonb_typeof(p_images) <> 'array'
      or jsonb_array_length(p_images) > 3
    then
      raise exception 'Invalid advertisement image list';
    end if;

    if exists (
      select 1
      from jsonb_to_recordset(p_images) as image(
        storage_path text,
        url text,
        sort_order smallint
      )
      where image.storage_path is null
        or image.url is null
        or image.sort_order is null
        or image.sort_order not between 0 and 2
        or image.storage_path not like current_user_id::text || '/' || p_ad_id::text || '/%'
    ) then
      raise exception 'Invalid advertisement image';
    end if;

    select coalesce(array_agg(existing.storage_path), array[]::text[])
    into removed_storage_paths
    from public.ad_images as existing
    where existing.ad_id = p_ad_id
      and not exists (
        select 1
        from jsonb_array_elements(p_images) as image
        where image ->> 'storage_path' = existing.storage_path
      );
  end if;

  update public.ads
  set category_id = p_category_id,
      city_id = p_city_id,
      description = p_description,
      price = p_price,
      province_id = p_province_id,
      title = p_title
  where id = p_ad_id
    and user_id = current_user_id;

  if p_images is not null then
    delete from public.ad_images
    where ad_id = p_ad_id;

    insert into public.ad_images (ad_id, storage_path, url, sort_order)
    select
      p_ad_id,
      image.storage_path,
      image.url,
      image.sort_order
    from jsonb_to_recordset(p_images) as image(
      storage_path text,
      url text,
      sort_order smallint
    );
  end if;

  return removed_storage_paths;
end;
$$;

revoke all on function public.update_owned_ad(
  uuid,
  smallint,
  integer,
  text,
  bigint,
  integer,
  text,
  jsonb
) from public, anon;

grant execute on function public.update_owned_ad(
  uuid,
  smallint,
  integer,
  text,
  bigint,
  integer,
  text,
  jsonb
) to authenticated;
