---
name: lcs-release-checklist
description: Production go-live checklist for LCS (migrations, RLS, roles smoke, contact, rate limit, backups, secrets). Use before deploy or when the user asks for release readiness.
---

# LCS release checklist

## Pre-deploy

- [ ] Migrations applied on prod Supabase
- [ ] RLS enabled on all tables; smoke test per role
- [ ] Env vars set on Vercel (no service role in public)
- [ ] First `super_admin` exists
- [ ] Contact form sends Resend + stores message + rate limit 429 works
- [ ] Login rate limit works; failures audited
- [ ] `/admin` has `noindex`; robots.txt ok
- [ ] Security headers present
- [ ] Backups/PITR confirmed; restore drill noted
- [ ] Cloudflare DNS/HTTPS/WAF basics
- [ ] Seed content (portafolio) verified on public site
- [ ] Sentry (or logs) receiving errors

## Smoke

1. Visit home anonymous  
2. Login editor → cannot open Usuarios  
3. Login super_admin → invite/change role audited  
4. Publish project → appears public + audit row  
5. Flood contact → 429
