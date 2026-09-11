alter table public.product_versions add column if not exists pine_path text;

alter table public.downloads drop constraint if exists downloads_file_type_check;
alter table public.downloads add constraint downloads_file_type_check check (file_type in ('EX5','MQ5','PINE','DOC'));
