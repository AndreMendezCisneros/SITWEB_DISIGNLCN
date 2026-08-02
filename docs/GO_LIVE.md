# Go-live LCS

## 1. Supabase

1. Crear proyecto Supabase.
2. Ejecutar migraciones **en orden**:
   - `web/supabase/migrations/20260802120000_init_lcs.sql`
   - `web/supabase/migrations/20260802140000_storage_media_bucket.sql`
   - `web/supabase/migrations/20260802160000_prod_hardening.sql`  
     (incluye `banners.placement`, índices, revoke RPCs, trigger viewer, contact sin insert anon)
3. Opcional: `web/supabase/seed.sql` (contenido demo).
4. Auth → deshabilitar **signup público**.
5. Crear usuario Auth e inicializar:

```sql
update public.profiles
set role = 'super_admin', is_active = true
where email = 'TU_EMAIL';
```

6. Storage: bucket `media` público (la migración 140000 / API lo crean).

### Aplicar hardening desde máquina local

```bash
# web/.env.local — DIRECT_URL = connection string Postgres (Settings → Database)
cd web
node scripts/apply-hardening.mjs
```

## 2. Vercel

1. Importar repo; **Root Directory = `web`**.
2. Variables desde `web/.env.example` (nunca subir `.env.local`).
3. `NEXT_PUBLIC_SITE_URL` = URL de producción.
4. Dominio custom → Vercel.

## 3. Cloudflare (recomendado)

1. DNS → Vercel.
2. HTTPS Full (strict).
3. WAF / Bot Fight; rate limit en `/api/contact` y rutas de login si el plan lo permite.

## 4. Resend

1. Verificar dominio (no dejar forever `onboarding@resend.dev` en prod).
2. `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`.
3. Probar formulario: éxito total vs “mensaje recibido sin email”.

## 5. Smoke test

- Público: home, nosotros, servicios, proyectos, contacto.
- Login cada rol → workspace correcto; viewer no edita.
- Crear banner con placement; singleton home.
- Upload imagen → aparece en Multimedia / picker.
- Mensaje de contacto → fila en Mensajes + correo (si Resend OK).

Skill: `lcs-release-checklist`. Detalle remediaciones: [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md).

## 6. Capacitación / workspaces

| Rol | URL base |
|-----|----------|
| Super Admin / Admin | `/admin` |
| Editor | `/editor` |
| Marketing | `/marketing` |
| Viewer | `/viewer` |

Login: `/admin/login`.
