create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, phone)
  values (
    new.id,
    nullif(
      coalesce(
        new.raw_user_meta_data ->> 'display_name',
        new.raw_user_meta_data ->> 'full_name',
        new.raw_user_meta_data ->> 'name'
      ),
      ''
    ),
    coalesce(
      nullif(new.raw_user_meta_data ->> 'phone', ''),
      case
        when new.phone like '+98%' then '0' || substring(new.phone from 4)
        else new.phone
      end
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

update public.profiles as profiles
set display_name = nullif(
  coalesce(
    users.raw_user_meta_data ->> 'display_name',
    users.raw_user_meta_data ->> 'full_name',
    users.raw_user_meta_data ->> 'name'
  ),
  ''
)
from auth.users as users
where profiles.id = users.id
  and profiles.display_name is null;
