-- =====================================================================
--  Hostel Website — database schema
--  Run once in Supabase: Dashboard → SQL Editor → paste → Run.
--  Safe to re-run: every statement is idempotent.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Admins: only users listed here can change content.
-- (Anyone could otherwise sign up with the public key and edit the site.)
-- ---------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;

drop policy if exists "admin reads own row" on public.admin_users;
create policy "admin reads own row" on public.admin_users
  for select to authenticated using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------
-- Site settings (single row, id = 1)
-- ---------------------------------------------------------------------
create table if not exists public.site_settings (
  id              int primary key default 1 check (id = 1),
  hostel_name     text not null default 'Your Hostel',
  hostel_type     text not null default 'Boys Hostel',
  tagline         text not null default 'A safe, clean and homely place to stay while you study.',
  logo_url        text,
  hero_slides     jsonb not null default '[]'::jsonb,   -- [{ "image": url, "title": text, "subtitle": text }]
  about_title     text not null default 'Welcome to our hostel',
  about_text      text not null default '',
  about_image     text,
  established_year int,
  phone           text,
  phone_alt       text,
  whatsapp        text,
  email           text,
  address         text,
  map_embed_url   text,
  office_hours    text,
  facebook_url    text,
  instagram_url   text,
  tiktok_url      text,
  youtube_url     text,
  admission_open  boolean not null default true,
  price_note      text,
  meta_description text,
  updated_at      timestamptz not null default now()
);
insert into public.site_settings (id) values (1) on conflict (id) do nothing;
alter table public.site_settings add column if not exists theme_color text not null default '#fd7444';
alter table public.site_settings alter column theme_color set default '#fd7444';
alter table public.site_settings add column if not exists secondary_color text not null default '#8cbb6a';
-- Big photo banner in the middle of the home page (e.g. "Homely meals")
alter table public.site_settings add column if not exists promo_title text not null default 'Homely meals';
alter table public.site_settings add column if not exists promo_subtitle text not null default 'Three fresh meals a day are included in your monthly fee';
alter table public.site_settings add column if not exists promo_image text;
alter table public.site_settings add column if not exists promo_badge_top text not null default 'meals';
alter table public.site_settings add column if not exists promo_badge_value text not null default '3 / day';
alter table public.site_settings add column if not exists promo_button_label text not null default 'See food menu';
alter table public.site_settings add column if not exists promo_button_link text not null default '#menu';

-- ---------------------------------------------------------------------
-- Room types and bed availability
-- ---------------------------------------------------------------------
-- Blocks & Floors
create table if not exists public.blocks (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  code         text not null default '',
  gender_type  text not null default 'All',
  description  text not null default '',
  image_url    text,
  sort_order   int not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now()
);

create table if not exists public.floors (
  id           uuid primary key default gen_random_uuid(),
  block_id     uuid not null references public.blocks (id) on delete cascade,
  name         text not null,
  floor_number int not null default 0,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);

create table if not exists public.rooms (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  block_id        uuid references public.blocks (id) on delete set null,
  floor_id        uuid references public.floors (id) on delete set null,
  block_name      text not null default '',
  floor_name      text not null default '',
  room_number     text not null default '',
  description     text not null default '',
  beds_per_room   int  not null default 1 check (beds_per_room between 1 and 20),
  total_beds      int  not null default 0 check (total_beds >= 0),
  available_beds  int  not null default 0 check (available_beds >= 0),
  monthly_fee     int  not null default 0 check (monthly_fee >= 0),
  admission_fee   int           check (admission_fee >= 0),
  features        text[] not null default '{}',
  images          text[] not null default '{}',
  is_published    boolean not null default true,
  sort_order      int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint rooms_available_le_total check (available_beds <= total_beds)
);

create table if not exists public.beds (
  id           uuid primary key default gen_random_uuid(),
  room_id      uuid not null references public.rooms (id) on delete cascade,
  bed_number   text not null,
  is_occupied  boolean not null default false,
  notes        text not null default '',
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Gallery, facilities, rules, notices, menu, testimonials, FAQs
-- ---------------------------------------------------------------------
create table if not exists public.gallery_images (
  id           uuid primary key default gen_random_uuid(),
  image_url    text not null,
  storage_path text,
  caption      text not null default '',
  category     text not null default 'General',
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);

create table if not exists public.facilities (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text,
  description  text not null default '',
  content      text not null default '',
  image_url    text,
  highlights   text[] not null default '{}',
  icon         text not null default 'check',
  is_published boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);
alter table public.facilities add column if not exists slug text;
alter table public.facilities add column if not exists image_url text;
alter table public.facilities add column if not exists content text not null default '';
alter table public.facilities add column if not exists highlights text[] not null default '{}';

create table if not exists public.rules (
  id           uuid primary key default gen_random_uuid(),
  category     text not null default 'General',
  content      text not null,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);

create table if not exists public.notices (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  body           text not null default '',
  image_url      text,
  storage_path   text,
  is_published   boolean not null default true,
  is_pinned      boolean not null default false,
  show_as_popup  boolean not null default false,
  popup_until    timestamptz,
  published_at   timestamptz not null default now(),
  created_at     timestamptz not null default now()
);

create table if not exists public.meal_menu (
  day        smallint primary key check (day between 0 and 6),   -- 0 = Sunday
  breakfast  text not null default '',
  lunch      text not null default '',
  snacks     text not null default '',
  dinner     text not null default ''
);
insert into public.meal_menu (day)
  select d from generate_series(0, 6) d
  on conflict (day) do nothing;

create table if not exists public.testimonials (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  role         text not null default '',
  message      text not null,
  rating       int  not null default 5 check (rating between 1 and 5),
  is_published boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);

alter table public.testimonials add column if not exists photo_url text;

create table if not exists public.faqs (
  id           uuid primary key default gen_random_uuid(),
  question     text not null,
  answer       text not null,
  is_published boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Enquiries / booking requests from the website
-- ---------------------------------------------------------------------
create table if not exists public.enquiries (
  id            uuid primary key default gen_random_uuid(),
  name          text not null check (char_length(name) between 2 and 100),
  phone         text not null check (char_length(phone) between 7 and 20),
  email         text check (email is null or char_length(email) <= 150),
  room_id       uuid references public.rooms (id) on delete set null,
  room_name     text check (room_name is null or char_length(room_name) <= 100),
  move_in_date  date,
  message       text check (message is null or char_length(message) <= 1500),
  status        text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at    timestamptz not null default now()
);
create index if not exists enquiries_created_idx on public.enquiries (created_at desc);

-- ---------------------------------------------------------------------
-- Row Level Security
--   Public (anon) can read published content and submit enquiries.
--   Only admins can write.
-- ---------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['site_settings','rooms','gallery_images','facilities','rules',
                           'notices','meal_menu','testimonials','faqs','enquiries','blocks','floors','beds']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "admin write" on public.%I', t);
    execute format(
      'create policy "admin write" on public.%I for all to authenticated
         using ((select public.is_admin())) with check ((select public.is_admin()))', t);
  end loop;
end $$;

-- Public read policies
drop policy if exists "public read" on public.site_settings;
create policy "public read" on public.site_settings for select to anon, authenticated using (true);

drop policy if exists "public read" on public.gallery_images;
create policy "public read" on public.gallery_images for select to anon, authenticated using (true);

drop policy if exists "public read" on public.rules;
create policy "public read" on public.rules for select to anon, authenticated using (true);

drop policy if exists "public read" on public.meal_menu;
create policy "public read" on public.meal_menu for select to anon, authenticated using (true);

drop policy if exists "public read" on public.blocks;
create policy "public read" on public.blocks for select to anon, authenticated using (is_published or (select public.is_admin()));

drop policy if exists "public read" on public.floors;
create policy "public read" on public.floors for select to anon, authenticated using (true);

drop policy if exists "public read" on public.beds;
create policy "public read" on public.beds for select to anon, authenticated using (true);

drop policy if exists "public read" on public.rooms;
create policy "public read" on public.rooms for select to anon, authenticated
  using (is_published or (select public.is_admin()));

drop policy if exists "public read" on public.facilities;
create policy "public read" on public.facilities for select to anon, authenticated
  using (is_published or (select public.is_admin()));

drop policy if exists "public read" on public.notices;
create policy "public read" on public.notices for select to anon, authenticated
  using (is_published or (select public.is_admin()));

drop policy if exists "public read" on public.testimonials;
create policy "public read" on public.testimonials for select to anon, authenticated
  using (is_published or (select public.is_admin()));

drop policy if exists "public read" on public.faqs;
create policy "public read" on public.faqs for select to anon, authenticated
  using (is_published or (select public.is_admin()));

-- Enquiries: anyone may submit a new one; only admins read/update/delete.
drop policy if exists "public submit" on public.enquiries;
create policy "public submit" on public.enquiries for insert to anon, authenticated
  with check (status = 'new');

-- ---------------------------------------------------------------------
-- Storage bucket for photos (public read, admin write)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media admin insert" on storage.objects;
create policy "media admin insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (select public.is_admin()));

drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects for update to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));

drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));

-- Admins need SELECT on their objects so upsert/delete work.
drop policy if exists "media admin select" on storage.objects;
create policy "media admin select" on storage.objects for select to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
