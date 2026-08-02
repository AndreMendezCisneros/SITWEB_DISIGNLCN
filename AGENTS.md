# LCS — Guía para agentes

Sitio corporativo **Luque Construcción y Servicios (LCS)** + CMS a medida.

## Arquitectura

- **App:** Next.js 15 (App Router) en `web/`
- **Backend:** Supabase (Auth, Postgres + RLS, Storage)
- **Público:** contenido `published` vía `services/content.ts`
- **CMS:** workspaces `/admin` `/editor` `/marketing` `/viewer`
- **Banners:** slots `placement` (`lib/cms/placements.ts`) — no page builder libre
- **Usuarios:** solo `super_admin` invita / cambia rol
- **API:** Route Handlers para secretos (contacto, auth, upload)
- Service role **nunca** `NEXT_PUBLIC_`

Docs: `docs/ARCHITECTURE.md`, `docs/CMS.md`, `docs/SECURITY.md`, `docs/PRODUCTION_READINESS.md`.

## Roles

`super_admin` | `admin` | `editor` | `marketing` | `viewer`  
Trigger de alta siempre crea `viewer`.

## v1 — fuera de alcance

Blog, newsletter, page builder libre, matriz `role_permissions`.

## Marca

Negro carbón + oro. Skills: `lcs-brand-ui`.

## Gobernanza

- Rules: `.cursor/rules/`
- Skills: `.cursor/skills/`

## Reglas de código

- TypeScript strict; Zod cliente + servidor (`parseEntityPayload`)
- Datos solo vía `web/src/services/*`
- Mutaciones → auditoría
- Endpoints públicos/auth → rate limit (RPC solo service_role)
- No inventar slots de banner fuera del catálogo
- No subir `.env*` ni secretos
