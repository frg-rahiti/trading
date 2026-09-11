-- Tahitian Trader V1 schema
create extension if not exists "pgcrypto";

create table if not exists public.profiles(
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'customer' check(role in('customer','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.products(
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  platform text not null check(platform in('mt5','tradingview')),
  description text not null default '',
  price_cents integer not null default 0,
  currency text not null default 'eur',
  published boolean not null default false,
  stripe_price_id text,
  stripe_standard_price_id text,
  stripe_developer_price_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.product_versions(
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  version text not null,
  release_date date not null default current_date,
  ex5_path text,
  mq5_path text,
  pine_path text,
  documentation_path text,
  created_at timestamptz not null default now(),
  unique(product_id,version)
);

create table if not exists public.orders(
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  status text not null default 'pending' check(status in('pending','paid','failed','refunded')),
  total_cents integer not null default 0,
  currency text not null default 'eur',
  created_at timestamptz not null default now()
);

create table if not exists public.order_items(
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity integer not null default 1 check(quantity>0),
  unit_price_cents integer not null default 0,
  license_type text
);

create table if not exists public.licenses(
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  product_id uuid not null references public.products(id),
  order_id uuid not null references public.orders(id),
  license_key text unique not null default encode(gen_random_bytes(12),'hex'),
  license_type text,
  status text not null default 'ACTIVE' check(status in('ACTIVE','REVOKED')),
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create table if not exists public.downloads(
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  license_id uuid not null references public.licenses(id) on delete cascade,
  version_id uuid not null references public.product_versions(id),
  file_type text not null check(file_type in('EX5','MQ5','PINE','DOC')),
  downloaded_at timestamptz not null default now()
);

create table if not exists public.backtests(
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  title text not null,
  report_path text,
  metrics jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.monte_carlo_reports(
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  title text not null,
  report_path text,
  metrics jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings(
  key text primary key,
  value jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_versions enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.licenses enable row level security;
alter table public.downloads enable row level security;
alter table public.backtests enable row level security;
alter table public.monte_carlo_reports enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "public can view published products" on public.products;
create policy "public can view published products" on public.products for select using(published=true);

drop policy if exists "public can view product versions" on public.product_versions;
drop policy if exists "public can view published product versions" on public.product_versions;
create policy "public can view published product versions" on public.product_versions for select using(exists(select 1 from public.products p where p.id=product_id and p.published=true));

drop policy if exists "users view own profile" on public.profiles;
create policy "users view own profile" on public.profiles for select using(auth.uid()=id);

drop policy if exists "users view own orders" on public.orders;
create policy "users view own orders" on public.orders for select using(auth.uid()=user_id);

drop policy if exists "users view own order items" on public.order_items;
create policy "users view own order items" on public.order_items for select using(exists(select 1 from public.orders o where o.id=order_id and o.user_id=auth.uid()));

drop policy if exists "users view own licenses" on public.licenses;
create policy "users view own licenses" on public.licenses for select using(auth.uid()=user_id);

drop policy if exists "users view own downloads" on public.downloads;
create policy "users view own downloads" on public.downloads for select using(auth.uid()=user_id);

drop policy if exists "public view backtests" on public.backtests;
create policy "public view backtests" on public.backtests for select using(true);

drop policy if exists "public view monte carlo" on public.monte_carlo_reports;
create policy "public view monte carlo" on public.monte_carlo_reports for select using(true);

drop policy if exists "public view site settings" on public.site_settings;
create policy "public view site settings" on public.site_settings for select using(true);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id,display_name) values(new.id,coalesce(new.raw_user_meta_data->>'full_name','')) on conflict(id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
revoke execute on function public.handle_new_user() from public;
revoke execute on function public.handle_new_user() from anon;
revoke execute on function public.handle_new_user() from authenticated;

insert into storage.buckets (id,name,public) values ('product-files','product-files',false) on conflict (id) do update set public=false;

drop policy if exists "admins can manage product files" on storage.objects;
create policy "admins can manage product files" on storage.objects for all using(exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin')) with check(exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
drop policy if exists "users can read licensed product files" on storage.objects;
