import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getAdminSession } from "../../../../../_lib/supabase/adminAuth";
import { getSupabaseConfig } from "../../../../../_lib/supabase/config";
import type { Database } from "../../../../../types/database.types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isValidUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function failure(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

/**
 * Send a password recovery email to a user account. The link lands on the existing
 * /auth/confirm route, which exchanges the recovery code for a session.
 *
 * The mail is sent through a stateless publishable-key client so the admin's own
 * session cookies are never rewritten by the recovery handshake.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) return failure("Unauthorized", 401);
  const { client: admin } = session;

  const { id } = await params;
  if (!isValidUuid(id)) return failure("Invalid user ID", 400);

  const { data: target, error: lookupError } =
    await admin.auth.admin.getUserById(id);
  if (lookupError) return failure(lookupError.message, 500);
  if (!target?.user?.email) {
    return failure("این حساب بدون ایمیل ثبت شده است.", 400);
  }
  if (
    target.user.banned_until &&
    target.user.banned_until > new Date().toISOString()
  ) {
    return failure("ابتدا مسدودی این حساب را بردارید.", 400);
  }

  const { url, publishableKey } = getSupabaseConfig();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL("/").toString();
  const mailer = createSupabaseClient<Database>(url, publishableKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error } = await mailer.auth.resetPasswordForEmail(target.user.email, {
    redirectTo: `${siteUrl.replace(/\/$/, "")}/auth/confirm?next=/profile`,
  });
  if (error) return failure(error.message, 500);

  return NextResponse.json({ ok: true, email: target.user.email });
}
