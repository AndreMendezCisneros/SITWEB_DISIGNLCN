import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  clearIdleCookie,
  IDLE_COOKIE,
  isIdleExpired,
  setIdleCookie,
} from "@/lib/auth/idle";
import { verifyAccessToken } from "@/lib/auth/jwt";
import {
  homeForRole,
  isWorkspacePath,
  resolveWorkspaceRedirect,
  workspaceFromPath,
} from "@/lib/auth/roles";
import { isSupabaseConfigured } from "@/lib/env";
import type { AppRole } from "@/types/database";

async function forceLoginRedirect(
  request: NextRequest,
  supabaseResponse: NextResponse,
  supabase: {
    auth: { signOut: () => Promise<unknown> };
  },
  reason?: "idle" | "jwt",
) {
  try {
    await supabase.auth.signOut();
  } catch {
    // ignore
  }
  const redirect = request.nextUrl.clone();
  redirect.pathname = "/admin/login";
  if (reason) redirect.searchParams.set("reason", reason);
  else redirect.searchParams.set("next", request.nextUrl.pathname);
  const res = NextResponse.redirect(redirect);
  clearIdleCookie(res);
  // Copiar cookies de signOut si las hubo
  supabaseResponse.cookies.getAll().forEach((c) => {
    res.cookies.set(c.name, c.value);
  });
  return res;
}

export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isLogin = path === "/admin/login";
  const onWorkspace = isWorkspacePath(path);

  // Público: sin Auth.
  if (!onWorkspace) {
    return NextResponse.next({ request });
  }

  if (!isSupabaseConfigured()) {
    if (!isLogin) {
      const redirect = request.nextUrl.clone();
      redirect.pathname = "/admin/login";
      return NextResponse.redirect(redirect);
    }
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isLogin && !user) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/admin/login";
    redirect.searchParams.set("next", path);
    return NextResponse.redirect(redirect);
  }

  if (!user) {
    return supabaseResponse;
  }

  // JWT local (jose) + idle 15 min — solo fuera de la página de login.
  if (!isLogin) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const accessToken = session?.access_token;
    if (accessToken) {
      const jwt = await verifyAccessToken(accessToken);
      if (!jwt.ok) {
        return forceLoginRedirect(request, supabaseResponse, supabase, "jwt");
      }
    }

    const lastActive = request.cookies.get(IDLE_COOKIE)?.value;
    if (isIdleExpired(lastActive)) {
      return forceLoginRedirect(request, supabaseResponse, supabase, "idle");
    }
    setIdleCookie(supabaseResponse);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role,is_active")
    .eq("id", user.id)
    .maybeSingle();

  const role = (profile?.role as AppRole | undefined) ?? null;
  const active = profile?.is_active !== false;

  if (!role || !active) {
    if (!isLogin) {
      const redirect = request.nextUrl.clone();
      redirect.pathname = "/admin/login";
      return NextResponse.redirect(redirect);
    }
    return supabaseResponse;
  }

  if (isLogin) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = homeForRole(role);
    return NextResponse.redirect(redirect);
  }

  const target = resolveWorkspaceRedirect(role, path);
  if (target && target !== path) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = target;
    return NextResponse.redirect(redirect);
  }

  if (workspaceFromPath(path)) {
    supabaseResponse.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return supabaseResponse;
}
