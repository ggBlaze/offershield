import { NextResponse, type NextRequest } from "next/server";
import { LOCALES, DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

/**
 * Per-request locale handling:
 *
 *   1) For the root path `/`, issue a true HTTP 307 redirect to the
 *      visitor's preferred locale (cookie > Accept-Language > default).
 *      This is the cleanest signal for search engines.
 *   2) For all other paths, derive the locale from the URL's first
 *      segment and propagate it to the rest of the request via a
 *      request header (visible to the root layout's `headers()` call
 *      and to server components) and a response cookie (so the next
 *      visit to `/` honors the preference).
 *
 * The root layout uses the request header to set `<html lang>` and to
 * seed the LocaleProvider, so the first server render of every page
 * is in the correct language for SEO.
 */
const LOCALE_COOKIE = "NEXT_LOCALE";
const LOCALE_HEADER = "x-offerShield-locale";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];
  const isRoot = pathname === "/";

  // 1) Root redirect — pick a locale and 307.
  if (isRoot) {
    const target = pickLocale(request, firstSegment);
    const url = request.nextUrl.clone();
    url.pathname = `/${target}`;
    return NextResponse.redirect(url, 307);
  }

  // 2) Non-root paths: derive locale from URL and propagate it.
  const locale = isLocale(firstSegment) ? firstSegment : DEFAULT_LOCALE;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Persist the choice in a cookie for the next visit to `/`.
  const current = request.cookies.get(LOCALE_COOKIE)?.value;
  if (current !== locale) {
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return response;
}

function pickLocale(request: NextRequest, firstSegment: string | undefined): string {
  // URL segment wins.
  if (isLocale(firstSegment)) return firstSegment;
  // Otherwise the saved cookie.
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookieLocale)) return cookieLocale;
  // Otherwise the Accept-Language header.
  const accept = request.headers.get("accept-language") ?? "";
  const preferred = accept
    .split(",")
    .map((p) => p.split(";")[0]?.trim().toLowerCase() ?? "")
    .map((tag) => tag.split("-")[0])
    .find((tag) => isLocale(tag));
  if (preferred) return preferred;
  // Fallback.
  return DEFAULT_LOCALE;
}

export const config = {
  // Run on all paths except Next internals, the API, and static files.
  matcher: ["/((?!api|_next/static|_next/image|favicon\\.svg|favicon\\.ico).*)"],
};

