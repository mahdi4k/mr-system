import type { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { formatPublishedAdEmail } from "../../../../../_features/ads/email";
import { getAdminSession } from "../../../../../_lib/supabase/adminAuth";
import {
  getEmailProvider,
  isEmailConfigured,
  sendEmail,
} from "../../../../../_lib/email/sender";
import type { Database } from "../../../../../types/database.types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const EMAIL_WARNING =
  "آگهی منتشر شد، اما ایمیل اطلاعرسانی به صاحب آگهی ارسال نشد. جزئیات در لاگ سرور ثبت شد.";

function failure(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

type AdminClient = SupabaseClient<Database>;

/**
 * Best-effort bookkeeping stamp. This column arrives with the notification
 * migration, so a database that has not applied it yet must log a warning and
 * carry on rather than fail a request that already published the ad.
 */
async function recordNotification(
  admin: AdminClient,
  adId: string,
): Promise<void> {
  const { error } = await admin
    .from("ads")
    .update({ publication_notified_at: new Date().toISOString() })
    .eq("id", adId);
  if (error) {
    console.error(
      `Could not record the publication notification for ad ${adId}. ` +
        `Apply supabase/migrations/20260927000000_ad_published_email.sql. ` +
        `Detail: ${error.message}`,
    );
  }
}

/**
 * Publish an ad and let the owner know by email.
 *
 * The moderation write happens here, server side, so the notification cannot be
 * skipped by a client that forgets to call a second endpoint. The
 * `status <> 'published'` guard makes the transition idempotent, which keeps a
 * double-clicked publish button from mailing the seller twice.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) return failure("Unauthorized", 401);
  const { client: admin } = session;

  const { id } = await params;
  if (!UUID_PATTERN.test(id)) return failure("Invalid ad ID.", 400);

  // `publication_notified_at` is deliberately not part of this select. It is
  // auxiliary bookkeeping, so a database that has not applied the notification
  // migration yet must still be able to publish an ad.
  const { data: ad, error: loadError } = await admin
    .from("ads")
    .select(
      "id, user_id, title, status, profile:profiles!ads_user_id_fkey(display_name, email)",
    )
    .eq("id", id)
    .maybeSingle();

  if (loadError) {
    console.error("Failed to load ad for publication:", loadError);
    return failure("آگهی برای انتشار بارگذاری نشد.", 500);
  }
  if (!ad) return failure("Ad not found.", 404);

  if (ad.status === "published") {
    return NextResponse.json({ status: "already_published" });
  }

  const { data: published, error: publishError } = await admin
    .from("ads")
    .update({ status: "published" })
    .eq("id", id)
    .neq("status", "published")
    .select("id")
    .maybeSingle();

  if (publishError) {
    console.error("Failed to publish ad:", publishError);
    return failure("انتشار آگهی ناموفق بود.", 500);
  }
  if (!published) {
    // Another request won the race; do not send a second email.
    return NextResponse.json({ status: "already_published" });
  }

  const profile = Array.isArray(ad.profile) ? ad.profile[0] : ad.profile;
  const recipient = profile?.email ?? null;
  if (!recipient) {
    // Nothing to send to, but the ad is live. Record the attempt so a later
    // publish does not retry a delivery that can never succeed.
    await recordNotification(admin, id);
    return NextResponse.json({ status: "published", notified: false });
  }

  if (!isEmailConfigured()) {
    console.warn(
      "Ad published without an owner email: no email provider is configured.",
    );
    return NextResponse.json({ status: "published", notified: false });
  }

  const email = formatPublishedAdEmail({
    adId: ad.id,
    recipientName: profile?.display_name ?? "",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "/",
    title: ad.title,
  });

  const result = await sendEmail({ ...email, to: recipient });
  if (!result.ok) {
    console.error(
      `Failed to send publication email via ${getEmailProvider()}:`,
      result.error,
    );
    // The ad stays published, so this is a warning rather than a failed request.
    // The provider's raw error stays in the server log; the moderator only needs
    // to know that the publication succeeded but the notice did not go out.
    return NextResponse.json({
      status: "published",
      notified: false,
      warning: EMAIL_WARNING,
    });
  }

  await recordNotification(admin, id);

  return NextResponse.json({ status: "published", notified: true });
}
