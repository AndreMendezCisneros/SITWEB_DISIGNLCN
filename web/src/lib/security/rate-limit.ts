import { createServiceClient } from "@/lib/supabase/server";
import { writeAuditEvent } from "@/lib/audit/write-audit-event";
import { hasSupabaseEnv } from "@/lib/env";

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfter: number;
};

const memoryBuckets = new Map<string, { windowStart: number; count: number }>();

function memoryRateLimit(
  key: string,
  limit: number,
  windowSec: number
): RateLimitResult {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = Math.floor(now / windowSec) * windowSec;
  const current = memoryBuckets.get(key);
  if (!current || current.windowStart !== windowStart) {
    memoryBuckets.set(key, { windowStart, count: 1 });
    return { allowed: true, remaining: limit - 1, retryAfter: 0 };
  }
  current.count += 1;
  if (current.count <= limit) {
    return {
      allowed: true,
      remaining: Math.max(limit - current.count, 0),
      retryAfter: 0,
    };
  }
  return {
    allowed: false,
    remaining: 0,
    retryAfter: Math.max(windowSec - (now - windowStart), 1),
  };
}

export async function enforceRateLimit(options: {
  key: string;
  limit: number;
  windowSec: number;
  ip?: string;
  requestId?: string;
  userAgent?: string;
}): Promise<RateLimitResult> {
  const { key, limit, windowSec, ip, requestId, userAgent } = options;

  let result: RateLimitResult;

  if (!hasSupabaseEnv() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    result = memoryRateLimit(key, limit, windowSec);
  } else {
    try {
      const supabase = createServiceClient();
      const { data, error } = await supabase.rpc("check_rate_limit", {
        p_key: key,
        p_limit: limit,
        p_window_seconds: windowSec,
      });
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      result = {
        allowed: Boolean(row?.allowed),
        remaining: Number(row?.remaining ?? 0),
        retryAfter: Number(row?.retry_after ?? 0),
      };
    } catch {
      result = memoryRateLimit(key, limit, windowSec);
    }
  }

  if (!result.allowed) {
    await writeAuditEvent({
      action: "security.rate_limit_hit",
      entityType: "rate_limit",
      entityId: key,
      summary: `Rate limit excedido: ${key}`,
      ip,
      userAgent,
      requestId,
      metadata: { limit, windowSec, retryAfter: result.retryAfter },
    });
  }

  return result;
}

export const RATE_LIMITS = {
  contactIpEmail: { limit: 5, windowSec: 15 * 60 },
  contactIp: { limit: 20, windowSec: 60 * 60 },
  loginIpEmail: { limit: 10, windowSec: 15 * 60 },
  loginIp: { limit: 50, windowSec: 60 * 60 },
  mediaUpload: { limit: 60, windowSec: 60 * 60 },
  adminMutations: { limit: 300, windowSec: 10 * 60 },
} as const;
