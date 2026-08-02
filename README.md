# LCS — Luque Construcción y Servicios

Sitio corporativo público + **CMS a medida** (Next.js 15, Supabase, Resend, Vercel).

| | |
|---|---|
| **Público** | https://tu-dominio (local: `http://localhost:3000`) |
| **Login CMS** | `/admin/login` → redirige al workspace del rol |
| **Stack** | Next.js 15 · TypeScript · Supabase (Auth/Postgres/Storage) · Resend · Vercel |

---

## Índice de documentación

| Documento | Contenido |
|-----------|-----------|
| [AGENTS.md](AGENTS.md) | Reglas para agentes / convenciones de código |
| [web/README.md](web/README.md) | App Next.js: scripts, estructura, variables |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Arquitectura, rutas, datos, workspaces |
| [docs/CMS.md](docs/CMS.md) | Módulos CMS, slots/ubicaciones, multimedia |
| [docs/SECURITY.md](docs/SECURITY.md) | Seguridad, roles, secretos, rate limits |
| [docs/AUDIT.md](docs/AUDIT.md) | Eventos de auditoría |
| [docs/GO_LIVE.md](docs/GO_LIVE.md) | Checklist de despliegue (Supabase → Vercel) |
| [docs/PRODUCTION_READINESS.md](docs/PRODUCTION_READINESS.md) | Remediaciones pre-prod aplicadas / pendientes |

---

## Inicio rápido (desarrollo)

```bash
cd web
cp .env.example .env.local   # completar keys (nunca subir .env.local)
npm install
npm run dev
```

- Sitio: http://localhost:3000  
- CMS: http://localhost:3000/admin/login  

Sin Supabase configurado, el público usa **seed local** (demo). En producción con Supabase, el seed **no** sustituye contenido vacío.

### Migraciones (orden)

1. `web/supabase/migrations/20260802120000_init_lcs.sql`
2. `web/supabase/migrations/20260802140000_storage_media_bucket.sql`
3. `web/supabase/migrations/20260802150000_banners_placement.sql` *(incluido también en hardening)*
4. `web/supabase/migrations/20260802160000_prod_hardening.sql` **obligatoria** (placement, índices, RPCs, trigger de rol)
5. Opcional: `web/supabase/seed.sql`

Con `DIRECT_URL` en `.env.local`:

```bash
cd web
node scripts/apply-hardening.mjs
```

O pegar el SQL en **Supabase → SQL Editor**.

---

## Workspaces por rol

| Rol | Base | Alcance |
|-----|------|---------|
| `super_admin` / `admin` | `/admin` | CMS completo (+ usuarios solo super_admin) |
| `editor` | `/editor` | Contenido + multimedia |
| `marketing` | `/marketing` | Banners, nosotros, clientes, stats, multimedia |
| `viewer` | `/viewer` | Solo lectura |

Login único: `/admin/login`.

---

## Qué no subir al repositorio

- `.env`, `.env.local`, cualquier archivo con keys
- `node_modules/`, `.next/`, `.vercel/`
- Service role, passwords de DB, exports de producción

Ver [`.gitignore`](.gitignore).

---

## Gobernanza Cursor

- Rules: `.cursor/rules/`
- Skills: `.cursor/skills/`
