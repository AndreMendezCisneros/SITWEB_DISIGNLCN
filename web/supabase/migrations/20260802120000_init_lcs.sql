-- LCS CMS initial schema: profiles, audit, rate limit, content, RLS

create extension if not exists "pgcrypto";

-- Roles
create type public.app_role as enum (
  'super_admin', 'admin', 'editor', 'marketing', 'viewer'
);

create type public.publish_status as enum ('draft', 'published', 'archived');

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role public.app_role not null default 'viewer',
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'viewer'::public.app_role
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.current_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid() and is_active = true;
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_active = true
      and role in ('super_admin','admin','editor','marketing','viewer')
  );
$$;

create or replace function public.can_write_content()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_active = true
      and role in ('super_admin','admin','editor','marketing')
  );
$$;

-- Audit (append-only)
create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  actor_id uuid references auth.users (id) on delete set null,
  actor_role text,
  actor_email text,
  action text not null,
  entity_type text,
  entity_id text,
  summary text,
  before jsonb,
  after jsonb,
  ip text,
  user_agent text,
  request_id text,
  metadata jsonb not null default '{}'::jsonb
);

create index audit_events_created_at_idx on public.audit_events (created_at desc);
create index audit_events_action_idx on public.audit_events (action);
create index audit_events_entity_idx on public.audit_events (entity_type, entity_id);

create or replace function public.write_audit_event(
  p_action text,
  p_entity_type text default null,
  p_entity_id text default null,
  p_summary text default null,
  p_before jsonb default null,
  p_after jsonb default null,
  p_ip text default null,
  p_user_agent text default null,
  p_request_id text default null,
  p_metadata jsonb default '{}'::jsonb,
  p_actor_id uuid default null,
  p_actor_role text default null,
  p_actor_email text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_actor uuid;
  v_role text;
  v_email text;
begin
  v_actor := coalesce(p_actor_id, auth.uid());
  if v_actor is not null then
    select role::text, email into v_role, v_email from public.profiles where id = v_actor;
  end if;
  insert into public.audit_events (
    actor_id, actor_role, actor_email, action, entity_type, entity_id,
    summary, before, after, ip, user_agent, request_id, metadata
  ) values (
    v_actor,
    coalesce(p_actor_role, v_role),
    coalesce(p_actor_email, v_email),
    p_action, p_entity_type, p_entity_id, p_summary, p_before, p_after,
    p_ip, p_user_agent, p_request_id, coalesce(p_metadata, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end;
$$;

-- Rate limit buckets
create table public.rate_limit_buckets (
  key text not null,
  window_start timestamptz not null,
  count integer not null default 0,
  primary key (key, window_start)
);

create or replace function public.check_rate_limit(
  p_key text,
  p_limit integer,
  p_window_seconds integer
)
returns table (allowed boolean, remaining integer, retry_after integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_window_start timestamptz;
  v_count integer;
  v_now timestamptz := now();
begin
  v_window_start := to_timestamp(
    floor(extract(epoch from v_now) / p_window_seconds) * p_window_seconds
  );

  insert into public.rate_limit_buckets as b (key, window_start, count)
  values (p_key, v_window_start, 1)
  on conflict (key, window_start)
  do update set count = b.count + 1
  returning b.count into v_count;

  if v_count <= p_limit then
    return query select true, greatest(p_limit - v_count, 0), 0;
  else
    return query select
      false,
      0,
      greatest(
        p_window_seconds - (extract(epoch from (v_now - v_window_start)))::integer,
        1
      );
  end if;
end;
$$;

-- Site settings
create table public.site_settings (
  id int primary key default 1 check (id = 1),
  company_name text not null default 'Luque Construcción y Servicios',
  company_short text not null default 'LCS',
  email text not null default 'contactenos@lcs.pe',
  phone text not null default '917 697 815',
  address text not null default 'Av. Manuel Olguín 335, Edificio Link Tower — Oficina 901, Surco',
  website text not null default 'https://www.lcs.pe',
  general_manager text not null default 'Jorge Luis Luque Solis',
  social jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (1);

create table public.seo_meta (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,
  title text,
  description text,
  og_image text,
  updated_at timestamptz not null default now()
);

create table public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  cta_label text,
  cta_href text,
  image_url text,
  sort_order int not null default 0,
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.about_sections (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title text not null,
  body text not null default '',
  image_url text,
  sort_order int not null default 0,
  status public.publish_status not null default 'published',
  updated_at timestamptz not null default now()
);

create table public.home_stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  sort_order int not null default 0,
  status public.publish_status not null default 'published'
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  image_url text,
  sort_order int not null default 0,
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text,
  location text,
  client_name text,
  entity text,
  year int,
  amount numeric(14,2),
  duration_days int,
  condition text,
  description text not null default '',
  image_url text,
  featured boolean not null default false,
  sort_order int not null default 0,
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  image_url text not null,
  alt text,
  sort_order int not null default 0
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  website text,
  sort_order int not null default 0,
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.certifications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  issuer text,
  document_url text,
  image_url text,
  valid_until date,
  sort_order int not null default 0,
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.coverage_regions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  province text,
  lat numeric(9,6),
  lng numeric(9,6),
  sort_order int not null default 0,
  status public.publish_status not null default 'published'
);

create table public.media_folders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  parent_id uuid references public.media_folders (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  folder_id uuid references public.media_folders (id) on delete set null,
  name text not null,
  path text not null,
  public_url text not null,
  mime_type text not null,
  size_bytes bigint not null default 0,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text not null,
  phone text,
  message text not null,
  is_read boolean not null default false,
  is_archived boolean not null default false,
  created_at timestamptz not null default now()
);

-- Generic audit trigger helper
create or replace function public.audit_row_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_action text;
  v_id text;
begin
  if tg_op = 'INSERT' then
    v_action := tg_table_name || '.create';
    v_id := new.id::text;
    perform public.write_audit_event(v_action, tg_table_name, v_id, 'Creación', null, to_jsonb(new));
    return new;
  elsif tg_op = 'UPDATE' then
    v_action := tg_table_name || '.update';
    v_id := new.id::text;
    perform public.write_audit_event(v_action, tg_table_name, v_id, 'Actualización', to_jsonb(old), to_jsonb(new));
    return new;
  elsif tg_op = 'DELETE' then
    v_action := tg_table_name || '.delete';
    v_id := old.id::text;
    perform public.write_audit_event(v_action, tg_table_name, v_id, 'Eliminación', to_jsonb(old), null);
    return old;
  end if;
  return null;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'banners','about_sections','home_stats','services','projects','clients',
    'certifications','coverage_regions','media_assets','contact_messages',
    'site_settings','seo_meta','profiles'
  ]
  loop
    execute format(
      'create trigger audit_%s after insert or update or delete on public.%I
       for each row execute function public.audit_row_change()',
      t, t
    );
  end loop;
end $$;

-- RLS
alter table public.profiles enable row level security;
alter table public.audit_events enable row level security;
alter table public.rate_limit_buckets enable row level security;
alter table public.site_settings enable row level security;
alter table public.seo_meta enable row level security;
alter table public.banners enable row level security;
alter table public.about_sections enable row level security;
alter table public.home_stats enable row level security;
alter table public.services enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.clients enable row level security;
alter table public.certifications enable row level security;
alter table public.coverage_regions enable row level security;
alter table public.media_folders enable row level security;
alter table public.media_assets enable row level security;
alter table public.contact_messages enable row level security;

-- Profiles policies
create policy profiles_select_staff on public.profiles
  for select to authenticated using (public.is_staff());
create policy profiles_update_self on public.profiles
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from public.profiles p where p.id = auth.uid()));
create policy profiles_super_admin_all on public.profiles
  for all to authenticated
  using (public.current_role() = 'super_admin')
  with check (public.current_role() = 'super_admin');

-- Audit: insert via RPC only (granted execute); select for admin+
create policy audit_select_admins on public.audit_events
  for select to authenticated
  using (public.current_role() in ('super_admin','admin'));

-- Rate limit: no direct client access
revoke all on public.rate_limit_buckets from anon, authenticated;

-- Published content read
create policy banners_public_read on public.banners for select using (status = 'published' or public.is_staff());
create policy about_public_read on public.about_sections for select using (status = 'published' or public.is_staff());
create policy stats_public_read on public.home_stats for select using (status = 'published' or public.is_staff());
create policy services_public_read on public.services for select using (status = 'published' or public.is_staff());
create policy projects_public_read on public.projects for select using (status = 'published' or public.is_staff());
create policy project_images_public_read on public.project_images for select using (
  exists (select 1 from public.projects p where p.id = project_id and (p.status = 'published' or public.is_staff()))
);
create policy clients_public_read on public.clients for select using (status = 'published' or public.is_staff());
create policy certs_public_read on public.certifications for select using (status = 'published' or public.is_staff());
create policy regions_public_read on public.coverage_regions for select using (status = 'published' or public.is_staff());
create policy settings_public_read on public.site_settings for select using (true);
create policy seo_public_read on public.seo_meta for select using (true);

-- Staff writes
create policy banners_staff_write on public.banners for all to authenticated
  using (public.can_write_content()) with check (public.can_write_content());
create policy about_staff_write on public.about_sections for all to authenticated
  using (public.can_write_content()) with check (public.can_write_content());
create policy stats_staff_write on public.home_stats for all to authenticated
  using (public.current_role() in ('super_admin','admin','marketing'))
  with check (public.current_role() in ('super_admin','admin','marketing'));
create policy services_staff_write on public.services for all to authenticated
  using (public.current_role() in ('super_admin','admin','editor'))
  with check (public.current_role() in ('super_admin','admin','editor'));
create policy projects_staff_write on public.projects for all to authenticated
  using (public.current_role() in ('super_admin','admin','editor'))
  with check (public.current_role() in ('super_admin','admin','editor'));
create policy project_images_staff_write on public.project_images for all to authenticated
  using (public.current_role() in ('super_admin','admin','editor'))
  with check (public.current_role() in ('super_admin','admin','editor'));
create policy clients_staff_write on public.clients for all to authenticated
  using (public.can_write_content()) with check (public.can_write_content());
create policy certs_staff_write on public.certifications for all to authenticated
  using (public.current_role() in ('super_admin','admin','editor'))
  with check (public.current_role() in ('super_admin','admin','editor'));
create policy regions_staff_write on public.coverage_regions for all to authenticated
  using (public.current_role() in ('super_admin','admin','editor'))
  with check (public.current_role() in ('super_admin','admin','editor'));
create policy settings_staff_write on public.site_settings for update to authenticated
  using (public.current_role() in ('super_admin','admin'))
  with check (public.current_role() in ('super_admin','admin'));
create policy seo_staff_write on public.seo_meta for all to authenticated
  using (public.current_role() in ('super_admin','admin'))
  with check (public.current_role() in ('super_admin','admin'));
create policy media_folders_staff on public.media_folders for all to authenticated
  using (public.can_write_content()) with check (public.can_write_content());
create policy media_assets_staff on public.media_assets for all to authenticated
  using (public.can_write_content()) with check (public.can_write_content());
create policy media_assets_read on public.media_assets for select using (public.is_staff());

create policy contact_insert_anon on public.contact_messages
  for insert to anon, authenticated with check (true);
create policy contact_staff_read on public.contact_messages
  for select to authenticated using (public.current_role() in ('super_admin','admin','editor','marketing','viewer'));
create policy contact_staff_update on public.contact_messages
  for update to authenticated
  using (public.current_role() in ('super_admin','admin'))
  with check (public.current_role() in ('super_admin','admin'));

grant execute on function public.check_rate_limit(text, integer, integer) to service_role;
grant execute on function public.write_audit_event(text, text, text, text, jsonb, jsonb, text, text, text, jsonb, uuid, text, text) to service_role;
