# LCS Web (aplicación)

Next.js 15 + Supabase + Resend. Este directorio es el **Root Directory** en Vercel.

## Desarrollo

```bash
cp .env.example .env.local
npm install
npm run dev
```

| Script | Uso |
|--------|-----|
| `npm run dev` | Desarrollo |
| `npm run build` | Build producción |
| `npm run lint` | ESLint |
| `npm test` | Tests unitarios |
| `node scripts/apply-hardening.mjs` | SQL hardening (requiere `DIRECT_URL`) |

## Variables (`.env.example`)

| Variable | Notas |
|----------|--------|
| `NEXT_PUBLIC_SITE_URL` | URL canónica / metadata |
| `NEXT_PUBLIC_SUPABASE_*` | Cliente + server |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo server |
| `DIRECT_URL` | Solo migraciones locales |
| `ALLOW_CONTENT_FALLBACK` | Forzar/prohibir seed |
| `RESEND_*` / `CONTACT_*` | Correo contacto |

**No commits de `.env*`.**

## Estructura `src/`

```
app/(public)/          Sitio
app/(admin|editor|…)/  Workspaces CMS
app/api/               contact, auth, media upload
components/public/     Hero, PageHero, ContactForm, …
components/cms/        Shell, paneles, galería
components/admin/      SimpleCrud, MediaGallery, upload, …
services/              content, auth, users
lib/auth|cms|seo|security|media|validators/
```

## Documentación del monorepo

Ver `../README.md` e índice en la raíz. Arquitectura: `../docs/ARCHITECTURE.md`. CMS: `../docs/CMS.md`.
