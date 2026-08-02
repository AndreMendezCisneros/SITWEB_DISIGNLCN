---
name: lcs-rate-limit-endpoint
description: Adds or adjusts Postgres-backed rate limiting on LCS Route Handlers or server actions. Use when creating public/auth endpoints or changing rate limit policy.
---

# Rate limit an LCS endpoint

## Steps

1. Choose key: `ip`, `ip:email`, or `user:<id>`.
2. Call `enforceRateLimit({ key, limit, windowSec })` from `web/src/lib/security/rate-limit.ts` **before** side effects (email, DB writes).
3. On deny: return `429` + `Retry-After`; write audit `security.rate_limit_hit`.
4. Keep limits aligned with `docs/SECURITY.md` (contact 5/15m per IP+email, login 10/15m, etc.).
5. Do **not** use in-memory Maps (serverless multi-instance).

## Contact example keys

- `contact:ip:<ip>`
- `contact:ipemail:<ip>:<emailHash>`
