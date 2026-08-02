# Production readiness — estado

Auditoría pre-prod (Next.js + Supabase + Vercel) y remediaciones aplicadas en código.

## Veredicto

El CMS tiene defensa en capas (middleware + guards + `canMutateTable` + RLS). El **viewer no muta**.  
Para go-live hay que **aplicar la migración de hardening en el proyecto Supabase remoto** y desactivar signup público.

## Remediaciones aplicadas (código)

| Ítem | Estado |
|------|--------|
| Trigger `handle_new_user` siempre `viewer` | ✅ (init + hardening); invite asigna rol vía service role |
| Middleware `getUser()` | ✅ |
| Zod + allowlist en save/deleteEntityAction | ✅ |
| Honeypot contacto + feedback Resend | ✅ |
| Seed no enmascara vacío en prod con Supabase | ✅ `useContentFallback()` |
| RPCs audit/rate-limit solo `service_role` | ✅ migración |
| Índices `(status, sort_order)` | ✅ migración |
| Contact sin INSERT anon | ✅ migración (solo API/service role) |
| SEO description + OG | ✅ `lib/seo.ts` |
| `error.tsx` / `global-error.tsx` / `not-found.tsx` | ✅ |
| `banners.placement` | ✅ migración |

## Acción obligatoria en Supabase

Ejecutar en SQL Editor (o `node scripts/apply-hardening.mjs` con `DIRECT_URL`):

```
web/supabase/migrations/20260802160000_prod_hardening.sql
```

En Auth → Providers: **deshabilitar signup público**.

Primer super_admin:

```sql
update public.profiles
set role = 'super_admin', is_active = true
where email = 'TU_EMAIL';
```

## Pendiente / P2 (no bloquea si se acepta riesgo)

- Magic bytes en upload (hoy MIME del cliente + allowlist)
- Origin allowlist en Route Handlers
- CAPTCHA en contacto
- Rate limit en mutaciones admin
- Sentry / APM
- Tests E2E (hoy ~unitarios)
- Consumir tabla `seo_meta` o retirarla
- Sustituir `<img>` de logos por `next/image`

## Variables de entorno (nunca en git)

Ver `web/.env.example`. En Vercel: root directory `web`.
