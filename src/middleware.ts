import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { locales, defaultLocale } from "@/i18n/config";

// Phase 1 scope note (unchanged): simple prefix-based locale routing.
function getLocaleFromPath(pathname: string) {
  const segment = pathname.split("/")[1];
  return locales.find((l) => l === segment);
}

// Admin/officer auth routes are NOT localized.
const PUBLIC_ADMIN_PATHS = ["/admin/login"];
const PROTECTED_PREFIXES = ["/admin", "/officer", "/blogger/dashboard", "/blogger/articles"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Teacher portal auth gate -----------------------------------------
  if (pathname === "/teacher/login" || pathname.startsWith("/teacher/login/")) {
    return NextResponse.next();
  }
  if (pathname === "/teacher/dashboard" || pathname.startsWith("/teacher/dashboard/")) {
    const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
    if (!token || token.role !== "TEACHER") {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/teacher/login";
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // --- Admin/officer auth gate ------------------------------------------
  if (
    PROTECTED_PREFIXES.some(
      (p) => pathname === p || pathname.startsWith(p + "/"),
    )
  ) {
    if (PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
      return NextResponse.next();
    }

    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });

    if (!token) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }

    if (pathname.startsWith("/blogger/dashboard") || pathname.startsWith("/blogger/articles")) {
      if (token.role !== "BLOGGER") {
        const loginUrl = request.nextUrl.clone(); loginUrl.pathname = token.role === "ADMIN" ? "/admin" : "/blogger/login"; return NextResponse.redirect(loginUrl);
      }
      return NextResponse.next();
    }
    if (pathname.startsWith("/admin") && token.role !== "ADMIN" && !PUBLIC_ADMIN_PATHS.some(p => pathname.startsWith(p))) {
      const adminUrl = request.nextUrl.clone(); adminUrl.pathname = token.role === "BLOGGER" ? "/blogger/dashboard" : "/officer"; return NextResponse.redirect(adminUrl);
    }

    // Allowed admin workspace routes.
    const allowedAdminPrefixes = [
      "/admin/login",
      "/admin/admissions",
      "/admin/officers",
      "/admin/administrators",
      "/admin/settings",
      "/admin/alumni",
      "/admin/notices",
      "/admin/careers",
      "/admin/help",
      "/admin/blog",
      "/admin/teachers",
    ];

    if (
      pathname.startsWith("/admin/") &&
      !allowedAdminPrefixes.some(
        (p) => pathname === p || pathname.startsWith(p + "/"),
      )
    ) {
      const adminUrl = request.nextUrl.clone();
      adminUrl.pathname = "/admin/admissions";
      adminUrl.search = "";
      return NextResponse.redirect(adminUrl);
    }

    return NextResponse.next();
  }

  if (pathname === "/blogger/login" || pathname.startsWith("/blogger/login/")) return NextResponse.next();
  if (pathname === "/blogger/dashboard" || pathname.startsWith("/blogger/dashboard/") || pathname === "/blogger/articles/new" || pathname.startsWith("/blogger/articles/")) {
    const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
    if (!token || token.role !== "BLOGGER") { const url=request.nextUrl.clone(); url.pathname="/blogger/login"; return NextResponse.redirect(url); }
    return NextResponse.next();
  }

  // --- Public site locale redirect --------------------------------------
  const hasLocale = getLocaleFromPath(pathname);

  if (hasLocale) {
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    /\.[^/]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
