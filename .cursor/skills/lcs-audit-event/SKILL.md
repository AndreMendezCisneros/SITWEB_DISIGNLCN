---
name: lcs-audit-event
description: Instruments or reviews LCS audit_events (RPC write_audit_event, triggers, admin UI). Use when adding audited actions, fixing audit gaps, or working on /admin/auditoria.
---

# LCS audit events

## Write path

Call server helper / RPC `write_audit_event` with:

- `action` namespaced (`project.publish`, `security.rate_limit_hit`)
- `entity_type`, `entity_id`
- `summary`, optional `before`/`after` (whitelisted fields only)
- `request_id`, `ip`, `user_agent` when available

## Rules

- Append-only; never UPDATE/DELETE from app roles.
- No passwords, tokens, or binary payloads.
- Auth failures and rate limits must be audited.
- UI at `/admin/auditoria` for `super_admin` and `admin` only.

See `docs/AUDIT.md`.
