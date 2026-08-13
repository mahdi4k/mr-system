import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "../../_lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const requestedNext = requestUrl.searchParams.get("next");
  const next =
    requestedNext?.startsWith("/") &&
    !requestedNext.startsWith("//") &&
    !requestedNext.includes("\\")
      ? requestedNext
      : "/profile";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const destination = new URL(next, requestUrl.origin);
      destination.searchParams.set("login", "success");
      return NextResponse.redirect(destination);
    }
  }

  return NextResponse.redirect(
    new URL("/login?error=confirmation", requestUrl.origin),
  );
}
