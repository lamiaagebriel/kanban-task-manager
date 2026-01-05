import { NextResponse, type NextRequest } from "next/server";

import {
  ensureValidLocale,
  i18n,
  Locale,
  LOCALE_COOKIE_KEY,
} from "@/lib/locale";

export function proxy(request: NextRequest) {
  // ----------------- localization
  const searchLocale = request.nextUrl.searchParams.get(LOCALE_COOKIE_KEY);
  const cookieLocale = request?.cookies?.get(LOCALE_COOKIE_KEY)?.value;
  const headerLocale = request?.headers
    .get("accept-language")
    ?.split(",")[0]
    .split("-")[0];

  // Resolve locale with priority: search param > cookie > header > default
  const resolvedLocale = ensureValidLocale(
    searchLocale || cookieLocale || headerLocale
  );

  const response = NextResponse.next();

  // Always ensure locale cookie is set with a valid value
  if (
    !cookieLocale ||
    !i18n.locales.includes(cookieLocale as Locale) ||
    (searchLocale && resolvedLocale !== cookieLocale)
  ) {
    response.cookies.set(LOCALE_COOKIE_KEY, resolvedLocale, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }

  return response;
}

export const config = {
  // Skip internal Next.js paths
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
