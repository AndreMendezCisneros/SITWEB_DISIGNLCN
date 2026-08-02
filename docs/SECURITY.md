# Seguridad LCS

## Capas

1. Cloudflare (DNS, HTTPS, WAF / rate basics) — ops
2. Middleware Next: auth workspaces con `getUser()`, headers, `X-Robots-Tag` en CMS
3. Zod en Route Handlers / Server Actions (allowlist de tablas)
4. Supabase RLS en tablas de negocio
5. Auditoría append-only (`audit_events` vía RPC solo `service_role`)

## Secretos

| Variable | Ámbito |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Cliente + server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cliente + server (RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Solo server** |
| `RESEND_API_KEY` | Solo server |
| `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL` | Solo server |
| `DIRECT_URL` | Solo local/CI para migraciones SQL — **nunca** en Vercel client |
| `ALLOW_CONTENT_FALLBACK` | Opcional (`true`/`false`) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cliente (widget Turnstile) |
| `TURNSTILE_SECRET_KEY` | **Solo server** (siteverify) |

Nunca exponer service role ni el secret de Turnstile al browser. No commitear `.env*`. Rotar keys si hay fuga.

## Roles

`super_admin` | `admin` | `editor` | `marketing` | `viewer`

- Signup/metadata **no** puede elevar rol: trigger crea siempre `viewer`.
- Invite: solo `super_admin`; rol se asigna con service role después del alta.
- Bootstrap primer super_admin: SQL manual sobre `profiles`.
- Viewer: UI read-only + `canMutateTable` false + RLS sin write.

## Uploads

Allowlist: `image/jpeg`, `image/png`, `image/webp`, `application/pdf`.  
Tamaño máx: 10 MB. Path server-side `uploads/{userId}/{uuid}.ext`.  
Optimización Sharp → WebP (imágenes). Rate limit por usuario.

## Contacto

Defensa en profundidad:

1. **Cloudflare Turnstile** — widget + verificación server (`siteverify`). Obligatorio en producción.
2. Rate limit IP + IP/email
3. Honeypot `website` (se acepta y se descarta en silencio)
4. Timing mínimo ~1.2s
5. Insert DB con service role; email Resend con `emailSent` en respuesta

Crear el widget en [Cloudflare Dashboard → Turnstile](https://dash.cloudflare.com/).  
Keys de prueba (siempre pasan): site `1x00000000000000000000AA`, secret `1x0000000000000000000000000000000AA`.  
En desarrollo sin keys, Turnstile se omite con un warning en logs (no en producción).

## Rate limits

Ver `docs/AUDIT.md` y `web/src/lib/security/rate-limit.ts`.  
RPC `check_rate_limit` solo ejecutable por `service_role`.

## Headers

`X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, CSP (revisar `unsafe-inline`/`unsafe-eval` a futuro).  
HSTS vía Cloudflare en producción.

## Checklist pre-deploy

1. Migración `20260802160000_prod_hardening.sql` aplicada  
2. Signup público OFF  
3. Variables Vercel (sin `DIRECT_URL` innecesario)  
4. Smoke por rol (skill `lcs-release-checklist`)  
5. Formulario contacto con/sin Resend  
6. Upload multimedia con rol editor/marketing  
