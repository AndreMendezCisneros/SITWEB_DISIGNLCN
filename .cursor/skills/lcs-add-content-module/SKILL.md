---
name: lcs-add-content-module
description: Adds a new LCS CMS content module (migration, RLS, service, admin CRUD, audit hooks, optional public page). Use when creating a new entity module for the LCS site or admin panel.
---

# Add LCS content module

## Steps

1. Migration in `web/supabase/migrations/`: table with `id`, `status`, `sort_order`, timestamps; enable RLS.
2. Policies: anon/auth SELECT published; staff INSERT/UPDATE/DELETE by role.
3. Audit trigger or service calls to `write_audit_event` on mutate.
4. Types + Zod in `web/src/lib/validators/`.
5. Service in `web/src/services/<module>.ts` (no queries in UI).
6. Admin routes under `web/src/app/(admin)/admin/<module>/` with DataTable + form.
7. Optional public page under `(public)` reading only published.
8. Register nav link in admin sidebar (respect roles).

## Do not

- Skip RLS or audit.
- Add blog/newsletter unless explicitly in scope.
---

## Checklist

- [ ] Migration + RLS
- [ ] Service layer
- [ ] Admin CRUD
- [ ] Audit events
- [ ] Public page if needed
