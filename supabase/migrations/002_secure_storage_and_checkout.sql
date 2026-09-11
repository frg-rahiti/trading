alter table public.products add column if not exists stripe_standard_price_id text;
alter table public.products add column if not exists stripe_developer_price_id text;

insert into storage.buckets (id, name, public)
values ('product-files', 'product-files', false)
on conflict (id) do update set public = false;

revoke execute on function public.handle_new_user() from anon, authenticated;
