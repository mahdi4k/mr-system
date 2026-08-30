-- Add bundle category to ad_categories
insert into public.ad_categories (id, value, name, icon, sort_order)
values (9, 'bundle', 'باندل (Bundle)', '/svg/bundle.svg', 9)
on conflict (id) do update set
  value = excluded.value,
  name = excluded.name,
  icon = excluded.icon,
  sort_order = excluded.sort_order;
