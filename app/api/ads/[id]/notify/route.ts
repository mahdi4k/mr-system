import { NextResponse } from "next/server";
import { formatTelegramAdMessage } from "../../../../_features/ads/telegram";
import { createAdminClient } from "../../../../_lib/supabase/admin";
import { createClient } from "../../../../_lib/supabase/server";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CLAIM_TIMEOUT_MS = 5 * 60 * 1000;

interface TelegramResponse {
  description?: string;
  ok: boolean;
}

function notificationConfig(): {
  botToken: string;
  chatId: string;
  siteUrl: string;
} {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!botToken || !chatId || !siteUrl) {
    throw new Error("Telegram notification configuration is incomplete.");
  }
  return { botToken, chatId, siteUrl };
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) {
    return NextResponse.json({ message: "Invalid ad ID." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data: ad, error: adError } = await supabase
    .from("ads")
    .select(
      "id, user_id, title, price, status, telegram_notification_claimed_at, telegram_notified_at",
    )
    .eq("id", id)
    .maybeSingle();
  if (adError) {
    console.error("Failed to load ad for Telegram notification:", adError);
    return NextResponse.json(
      { message: "Notification could not be prepared." },
      { status: 500 },
    );
  }
  if (!ad || ad.user_id !== user.id) {
    return NextResponse.json({ message: "Ad not found." }, { status: 404 });
  }
  if (ad.status !== "pending") {
    return NextResponse.json(
      { message: "Only pending ads can trigger this notification." },
      { status: 409 },
    );
  }
  if (ad.telegram_notified_at) {
    return NextResponse.json({ status: "already_notified" });
  }

  let config: ReturnType<typeof notificationConfig>;
  let admin: ReturnType<typeof createAdminClient>;
  try {
    config = notificationConfig();
    admin = createAdminClient();
  } catch (error) {
    console.error("Telegram notification is not configured:", error);
    return NextResponse.json(
      { message: "Notification service is unavailable." },
      { status: 503 },
    );
  }

  const claimTime = new Date().toISOString();
  const existingClaimTime = ad.telegram_notification_claimed_at
    ? new Date(ad.telegram_notification_claimed_at).getTime()
    : null;
  const claimIsStale =
    existingClaimTime !== null &&
    Date.now() - existingClaimTime >= CLAIM_TIMEOUT_MS;

  let claimQuery = admin
    .from("ads")
    .update({ telegram_notification_claimed_at: claimTime })
    .eq("id", id)
    .is("telegram_notified_at", null);
  claimQuery = ad.telegram_notification_claimed_at
    ? claimQuery.eq(
        "telegram_notification_claimed_at",
        ad.telegram_notification_claimed_at,
      )
    : claimQuery.is("telegram_notification_claimed_at", null);

  if (ad.telegram_notification_claimed_at && !claimIsStale) {
    return NextResponse.json(
      { status: "notification_in_progress" },
      { status: 202 },
    );
  }

  const { data: claimedAd, error: claimError } = await claimQuery
    .select("id")
    .maybeSingle();
  if (claimError) {
    console.error("Failed to claim Telegram notification:", claimError);
    return NextResponse.json(
      { message: "Notification could not be claimed." },
      { status: 500 },
    );
  }
  if (!claimedAd) {
    return NextResponse.json({ status: "already_claimed" }, { status: 202 });
  }

  const seller =
    user.user_metadata?.display_name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "کاربر ریگورا";
  const text = formatTelegramAdMessage({
    adId: ad.id,
    price: ad.price,
    seller,
    siteUrl: config.siteUrl,
    title: ad.title,
  });

  try {
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${config.botToken}/sendMessage`,
      {
        body: JSON.stringify({
          chat_id: config.chatId,
          disable_web_page_preview: true,
          text,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
        signal: AbortSignal.timeout(10_000),
      },
    );
    const telegramResult = (await telegramResponse.json()) as TelegramResponse;
    if (!telegramResponse.ok || !telegramResult.ok) {
      throw new Error(
        telegramResult.description ||
          `Telegram returned ${telegramResponse.status}`,
      );
    }
  } catch (error) {
    await admin
      .from("ads")
      .update({ telegram_notification_claimed_at: null })
      .eq("id", id)
      .eq("telegram_notification_claimed_at", claimTime);
    console.error("Failed to send Telegram ad notification:", error);
    return NextResponse.json(
      { message: "Telegram notification failed." },
      { status: 502 },
    );
  }

  const { error: completionError } = await admin
    .from("ads")
    .update({
      telegram_notification_claimed_at: null,
      telegram_notified_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("telegram_notification_claimed_at", claimTime);
  if (completionError) {
    console.error("Failed to complete Telegram notification:", completionError);
    return NextResponse.json(
      { message: "Notification was sent but could not be recorded." },
      { status: 500 },
    );
  }

  return NextResponse.json({ status: "notified" });
}
