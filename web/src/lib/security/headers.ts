import type { NextResponse } from "next/server";

export function applySecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "img-src 'self' data: blob: https:",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.resend.com https://challenges.cloudflare.com",
      "frame-src 'self' https://www.openstreetmap.org https://www.google.com https://maps.google.com https://*.google.com https://*.gstatic.com https://challenges.cloudflare.com",
      "child-src 'self' https://www.openstreetmap.org https://www.google.com https://maps.google.com https://*.google.com https://challenges.cloudflare.com",
      "frame-ancestors 'none'",
    ].join("; ")
  );
  return response;
}
