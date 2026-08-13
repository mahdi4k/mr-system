create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  ad_id uuid not null references public.ads (id) on delete cascade,
  buyer_id uuid not null references public.profiles (id) on delete cascade,
  seller_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint conversations_participants_differ check (buyer_id <> seller_id),
  constraint conversations_ad_buyer_unique unique (ad_id, buyer_id)
);

create table if not exists public.messages (
  id bigint generated always as identity primary key,
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  content text not null check (char_length(trim(content)) between 1 and 2000),
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index if not exists conversations_buyer_updated_idx
  on public.conversations (buyer_id, updated_at desc);
create index if not exists conversations_seller_updated_idx
  on public.conversations (seller_id, updated_at desc);
create index if not exists messages_conversation_created_idx
  on public.messages (conversation_id, created_at desc);

alter table public.conversations enable row level security;
alter table public.messages enable row level security;

grant select on table public.conversations to authenticated;
grant select, insert on table public.messages to authenticated;
grant usage, select on sequence public.messages_id_seq to authenticated;
revoke insert, update, delete on table public.conversations from anon, authenticated;
revoke update, delete on table public.messages from anon, authenticated;

create or replace function public.is_conversation_participant(conversation_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.conversations
    where conversations.id = conversation_uuid
      and (select auth.uid()) in (conversations.buyer_id, conversations.seller_id)
  );
$$;

revoke all on function public.is_conversation_participant(uuid) from public;
grant execute on function public.is_conversation_participant(uuid) to authenticated;

drop policy if exists "Published ads and owner ads are readable" on public.ads;
create policy "Published ads owner and participants are readable"
on public.ads for select
to anon, authenticated
using (
  status = 'published'
  or (select auth.uid()) = user_id
  or exists (
    select 1 from public.conversations
    where conversations.ad_id = ads.id
      and (select auth.uid()) in (conversations.buyer_id, conversations.seller_id)
  )
);

drop policy if exists "Visible ad images are readable" on public.ad_images;
create policy "Visible ad images are readable"
on public.ad_images for select
to anon, authenticated
using (
  exists (
    select 1 from public.ads
    where ads.id = ad_images.ad_id
      and (
        ads.status = 'published'
        or ads.user_id = (select auth.uid())
        or coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
        or exists (
          select 1 from public.conversations
          where conversations.ad_id = ads.id
            and (select auth.uid()) in (
              conversations.buyer_id,
              conversations.seller_id
            )
        )
      )
  )
);

drop policy if exists "Participants read conversations" on public.conversations;
create policy "Participants read conversations"
on public.conversations for select
to authenticated
using ((select auth.uid()) in (buyer_id, seller_id));

drop policy if exists "Participants read messages" on public.messages;
create policy "Participants read messages"
on public.messages for select
to authenticated
using (public.is_conversation_participant(conversation_id));

drop policy if exists "Participants send their own messages" on public.messages;
create policy "Participants send their own messages"
on public.messages for insert
to authenticated
with check (
  sender_id = (select auth.uid())
  and public.is_conversation_participant(conversation_id)
);

drop policy if exists "Profiles are readable when publicly relevant" on public.profiles;
create policy "Profiles are readable when publicly relevant"
on public.profiles for select
to anon, authenticated
using (
  (select auth.uid()) = id
  or coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
  or exists (
    select 1 from public.ads
    where ads.user_id = profiles.id and ads.status = 'published'
  )
  or exists (
    select 1 from public.conversations
    where (select auth.uid()) in (conversations.buyer_id, conversations.seller_id)
      and profiles.id in (conversations.buyer_id, conversations.seller_id)
  )
);

create or replace function public.get_or_create_conversation(ad_uuid uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  ad_owner_id uuid;
  conversation_uuid uuid;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  select ads.user_id into ad_owner_id
  from public.ads
  where ads.id = ad_uuid and ads.status = 'published';

  if ad_owner_id is null then
    raise exception 'Advertisement not found or unavailable';
  end if;
  if ad_owner_id = current_user_id then
    raise exception 'You cannot start a conversation for your own advertisement';
  end if;

  insert into public.conversations (ad_id, buyer_id, seller_id)
  values (ad_uuid, current_user_id, ad_owner_id)
  on conflict (ad_id, buyer_id) do update
    set updated_at = public.conversations.updated_at
  returning id into conversation_uuid;

  return conversation_uuid;
end;
$$;

revoke all on function public.get_or_create_conversation(uuid) from public;
grant execute on function public.get_or_create_conversation(uuid) to authenticated;

create or replace function public.mark_conversation_read(conversation_uuid uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_conversation_participant(conversation_uuid) then
    raise exception 'Conversation not found';
  end if;

  update public.messages
  set read_at = now()
  where conversation_id = conversation_uuid
    and sender_id <> (select auth.uid())
    and read_at is null;
end;
$$;

revoke all on function public.mark_conversation_read(uuid) from public;
grant execute on function public.mark_conversation_read(uuid) to authenticated;

create or replace function public.touch_conversation_on_message()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.conversations
  set updated_at = new.created_at
  where id = new.conversation_id;
  return new;
end;
$$;

revoke all on function public.touch_conversation_on_message() from public;

drop trigger if exists messages_touch_conversation on public.messages;
create trigger messages_touch_conversation
after insert on public.messages
for each row execute function public.touch_conversation_on_message();

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end $$;
