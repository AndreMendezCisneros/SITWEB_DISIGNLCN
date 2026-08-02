-- Production readiness hardening (P0/P1)
-- 1) Banners placement (idempotent if already applied)
-- 2) Signup: never trust role from user metadata
-- 3) Revoke sensitive RPCs from anon/authenticated
-- 4) Indexes for public list queries
-- 5) Contact inserts only via service role (app API)

-- ---------------------------------------------------------------------------
-- Banners.placement
-- ---------------------------------------------------------------------------
alter table public.banners
  add column if not exists placement text not null default 'home.hero';

comment on column public.banners.placement is
  'Slot del sitio: home.hero, nosotros.hero, servicios.hero, etc.';

with ordered as (
  select
    id,
    row_number() over (order by sort_order asc, created_at asc) as rn
  from public.banners
)
update public.banners b
set
  placement = coalesce(nullif(b.placement, ''), 'home.hero'),
  status = case
    when o.rn = 1 then b.status
    when b.status = 'published' and b.placement = 'home.hero' then 'draft'::public.publish_status
    else b.status
  end
from ordered o
where b.id = o.id;

create unique index if not exists banners_one_published_per_placement
  on public.banners (placement)
  where status = 'published';

-- ---------------------------------------------------------------------------
-- handle_new_user: always viewer (invite/admin sets role via service role)
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- RPCs: only service_role (app uses createServiceClient)
-- ---------------------------------------------------------------------------
revoke execute on function public.check_rate_limit(text, integer, integer)
  from anon, authenticated;
revoke execute on function public.write_audit_event(
  text, text, text, text, jsonb, jsonb, text, text, text, jsonb, uuid, text, text
) from anon, authenticated;

grant execute on function public.check_rate_limit(text, integer, integer)
  to service_role;
grant execute on function public.write_audit_event(
  text, text, text, text, jsonb, jsonb, text, text, text, jsonb, uuid, text, text
) to service_role;

-- ---------------------------------------------------------------------------
-- Public listing indexes (status + sort_order)
-- ---------------------------------------------------------------------------
create index if not exists banners_status_sort_idx
  on public.banners (status, sort_order);
create index if not exists about_sections_status_sort_idx
  on public.about_sections (status, sort_order);
create index if not exists home_stats_status_sort_idx
  on public.home_stats (status, sort_order);
create index if not exists services_status_sort_idx
  on public.services (status, sort_order);
create index if not exists projects_status_sort_idx
  on public.projects (status, sort_order);
create index if not exists projects_featured_status_sort_idx
  on public.projects (featured, status, sort_order)
  where featured = true;
create index if not exists clients_status_sort_idx
  on public.clients (status, sort_order);
create index if not exists certifications_status_sort_idx
  on public.certifications (status, sort_order);
create index if not exists coverage_regions_status_sort_idx
  on public.coverage_regions (status, sort_order);
create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);
create index if not exists media_assets_created_at_idx
  on public.media_assets (created_at desc);

-- ---------------------------------------------------------------------------
-- Contact: remove open anon insert (API uses service_role)
-- ---------------------------------------------------------------------------
drop policy if exists contact_insert_anon on public.contact_messages;
