-- Ubicación fija del banner en el sitio (slot tipo WordPress).
alter table public.banners
  add column if not exists placement text not null default 'home.hero';

comment on column public.banners.placement is
  'Slot del sitio: home.hero, nosotros.hero, servicios.hero, etc.';

-- Backfill: el primero por sort_order queda en home.hero;
-- el resto pasa a borrador para no violar el singleton publicado.
with ordered as (
  select
    id,
    row_number() over (order by sort_order asc, created_at asc) as rn
  from public.banners
)
update public.banners b
set
  placement = 'home.hero',
  status = case
    when o.rn = 1 then b.status
    when b.status = 'published' then 'draft'::public.publish_status
    else b.status
  end
from ordered o
where b.id = o.id;

-- Solo un banner publicado por slot.
create unique index if not exists banners_one_published_per_placement
  on public.banners (placement)
  where status = 'published';
