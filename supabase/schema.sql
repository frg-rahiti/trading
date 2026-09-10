-- Tahitian Trader V1 schema
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text,
 role text not null default 'customer' check (role in ('customer','admin')),
 created_at timestamptz not null default now()
);
create table if not exists public.products (
 id uuid primary key default gen_random_uuid(),
 slug text unique not null,
 name text not null,
 platform text not null check (platform in ('mt5','tradingview')),
 description text,
 published boolean not null default false,
 created_at timestamptz not null default now()
);
create table if not exists public.product_versions (
 id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
 version text not null, ex5_path text, mq5_path text, released_at timestamptz not null default now(), unique(product_id,version)
);
create table if not exists public.orders (
 id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id), stripe_checkout_session_id text unique,
 status text not null default 'pending', amount_cents integer, currency text default 'eur', created_at timestamptz not null default now()
);
create table if not exists public.order_items (
 id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
 product_id uuid not null references public.products(id), license_type text not null
);
create table if not exists public.licenses (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 product_id uuid not null references public.products(id), order_id uuid references public.orders(id), license_key text unique not null default encode(gen_random_bytes(12),'hex'),
 license_type text not null check (license_type in ('standard','developer')), status text not null default 'active' check (status in ('active','revoked')),
 created_at timestamptz not null default now()
);
create table if not exists public.downloads (
 id uuid primary key default gen_random_uuid(), license_id uuid not null references public.licenses(id) on delete cascade,
 version_id uuid references public.product_versions(id), downloaded_at timestamptz not null default now()
);
create table if not exists public.backtests (
 id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
 label text not null, market text, timeframe text, period text, trade_count integer, win_rate numeric, net_profit numeric, max_drawdown numeric, report_path text, created_at timestamptz not null default now()
);
create table if not exists public.monte_carlo_reports (
 id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
 label text not null, simulations integer, worst_drawdown numeric, probability_of_loss numeric, report_path text, created_at timestamptz not null default now()
);
create table if not exists public.site_settings (key text primary key, value jsonb not null default '{}'::jsonb);

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

create policy "public can view published products" on public.products for select using (published = true);
create policy "users view own profile" on public.profiles for select using (auth.uid() = id);
create policy "users view own orders" on public.orders for select using (auth.uid() = user_id);
create policy "users view own licenses" on public.licenses for select using (auth.uid() = user_id);
create policy "users view own downloads" on public.downloads for select using (exists (select 1 from public.licenses l where l.id = license_id and l.user_id = auth.uid()));
create policy "public view backtests" on public.backtests for select using (true);
create policy "public view monte carlo" on public.monte_carlo_reports for select using (true);
