import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./app/_lib/supabase/proxy";
import { PRODUCTION_SITE_URL } from "./app/_utils/siteUrl";

export default async function proxy(request: NextRequest) {
  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    "";
  // ponytail: kill duplicate domain at source — *.vercel.app 308s to
  // rigora.ir so Google only ever indexes the canonical host (free-plan safe).
  if (host.endsWith(".vercel.app")) {
    return NextResponse.redirect(
      new URL(
        `${request.nextUrl.pathname}${request.nextUrl.search}`,
        PRODUCTION_SITE_URL,
      ),
      308,
    );
  }
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
