import { type NextRequest } from "next/server";
import { applySecurityHeaders } from "@/lib/security/headers";
import { createRequestId } from "@/lib/security/request-id";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") ?? createRequestId();
  const response = await updateSession(request);
  response.headers.set("x-request-id", requestId);
  applySecurityHeaders(response);

  const path = request.nextUrl.pathname;
  if (
    path.startsWith("/admin") ||
    path.startsWith("/editor") ||
    path.startsWith("/marketing") ||
    path.startsWith("/viewer")
  ) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|brand/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
