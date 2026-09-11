alter table public.products add column if not exists stripe_price_id text;

alter table public.order_items drop constraint if exists order_items_license_type_check;
alter table public.order_items alter column license_type drop not null;
alter table public.order_items alter column license_type drop default;

alter table public.licenses drop constraint if exists licenses_license_type_check;
alter table public.licenses alter column license_type drop not null;
alter table public.licenses alter column license_type drop default;
