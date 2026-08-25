import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const LOGIN_PATH = "/admin/login";
const STAFF_ROLES = new Set(["admin", "editor"]);

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const isLoginPath = request.nextUrl.pathname === LOGIN_PATH;

  // Modo de Demonstração Local (quando Supabase ainda não está conectado com credenciais remotas)
  if (!supabaseUrl || !supabasePublishableKey) {
    const demoSession = request.cookies.get("monarq_admin_session");

    if (demoSession?.value) {
      if (isLoginPath) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return response;
    }

    if (!isLoginPath) {
      return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    }
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (!isLoginPath) {
      return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    }
    return response;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const isStaff = !!profile && STAFF_ROLES.has(profile.role);

  if (!isStaff) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isLoginPath) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
