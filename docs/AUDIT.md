# Auditoría LCS

## Tabla `audit_events`

Append-only. Escritura solo vía RPC `write_audit_event` (**SECURITY DEFINER**, EXECUTE solo `service_role` tras hardening).  
Sin UPDATE/DELETE para roles de aplicación.

### Campos

`id`, `created_at`, `actor_id`, `actor_role`, `actor_email`, `action`, `entity_type`, `entity_id`, `summary`, `before`, `after`, `ip`, `user_agent`, `request_id`, `metadata`.

### Acciones (namespaced)

- Auth: `auth.login_success`, `auth.login_failure`, `auth.logout`, …
- Users: `user.role_changed`, `user.invited`, …
- Content: `project.publish`, `service.update`, …
- Media: `media.upload`, `media.delete`, …
- Contact: `contact.message_received`, …
- Security: `security.rate_limit_hit`, `security.forbidden_access`

## Retención

Default **365 días**. Purga solo con job privilegiado + export previo (super_admin).

## UI

`/admin/auditoria` — lectura `super_admin` y `admin`.  
Export CSV: solo `super_admin`.

## Qué no loguear

Passwords, tokens, bodies binarios. Media: id, path, mime, size.
