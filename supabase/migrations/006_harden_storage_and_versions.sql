drop policy if exists "users can read licensed product files" on storage.objects;

drop policy if exists "public can view product versions" on public.product_versions;
create policy "public can view published product versions" on public.product_versions for select using (exists (select 1 from public.products p where p.id = product_id and p.published = true));
