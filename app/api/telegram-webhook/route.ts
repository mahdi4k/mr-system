import { NextResponse } from "next/server";
import { createAdminClient } from "../../_lib/supabase/admin";
import {
  downloadTelegramFile,
  getTelegramFileInfo,
  getTelegramWebhookConfig,
  parseTelegramAdContent,
} from "../../_features/ads/telegramWebhook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface TelegramPhotoSize {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  file_size?: number;
}

interface TelegramMessage {
  message_id: number;
  from?: { id: number; is_bot?: boolean; username?: string };
  chat: { id: number; type: string };
  text?: string;
  caption?: string;
  photo?: TelegramPhotoSize[];
  document?: { file_id: string; mime_type?: string };
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
  channel_post?: TelegramMessage;
}

async function sendTelegramReply(
  chatId: number,
  text: string,
  botToken: string,
): Promise<void> {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
        signal: AbortSignal.timeout(10_000),
      },
    );
    const result = (await response.json().catch(() => null)) as {
      ok?: boolean;
      description?: string;
    } | null;
    if (!response.ok || !result?.ok) {
      console.error(
        "Failed to send Telegram reply:",
        result?.description || response.status,
      );
    }
  } catch (error) {
    console.error("Failed to send Telegram reply:", error);
  }
}

function getMessageFromUpdate(
  update: TelegramUpdate,
): TelegramMessage | undefined {
  return update.message ?? update.edited_message ?? update.channel_post;
}

export async function POST(req: Request) {
  let config: ReturnType<typeof getTelegramWebhookConfig>;
  try {
    config = getTelegramWebhookConfig();
  } catch (error) {
    console.error("Telegram webhook is not configured:", error);
    return NextResponse.json(
      { message: "Webhook not configured" },
      { status: 503 },
    );
  }

  const secretHeader = req.headers.get("x-telegram-bot-api-secret-token");
  if (secretHeader !== config.webhookSecret) {
    return new Response("Unauthorized", { status: 401 });
  }

  let update: TelegramUpdate;
  try {
    update = (await req.json()) as TelegramUpdate;
  } catch {
    return NextResponse.json({ ok: true });
  }

  const msg = getMessageFromUpdate(update);
  if (!msg) return NextResponse.json({ ok: true });

  // Only allow your own Telegram account
  if (msg.from?.id !== config.ownerTelegramId) {
    return NextResponse.json({ ok: true });
  }

  const rawText = (msg.caption ?? msg.text ?? "").trim();
  // Biggest photo size is last element
  const photoFileId = msg.photo?.at(-1)?.file_id ?? msg.document?.file_id;

  if (!rawText && !photoFileId) {
    await sendTelegramReply(
      msg.chat.id,
      "⚠️ پیام خالی است — متن یا عکس بفرستید.",
      config.botToken,
    );
    return NextResponse.json({ ok: true });
  }

  const effectiveText = rawText || "آگهی تلگرام";
  const parsed = parseTelegramAdContent(effectiveText);

  let admin: ReturnType<typeof createAdminClient>;
  try {
    admin = createAdminClient();
  } catch (error) {
    console.error("Failed to create admin client:", error);
    await sendTelegramReply(
      msg.chat.id,
      "❌ خطای سرور — پیکربندی Supabase ناقص است.",
      config.botToken,
    );
    return NextResponse.json({ ok: true });
  }

  // Idempotency: deduplicate by Telegram update_id (prevents double ads on retries)
  if (typeof update.update_id === "number") {
    const { error: dedupError } = await admin
      .from("telegram_webhook_events")
      .insert({
        update_id: update.update_id,
        message_id: msg.message_id,
        chat_id: msg.chat.id,
      });
    if (dedupError) {
      // Unique violation means already processed — acknowledge and stop
      if ((dedupError as { code?: string }).code === "23505") {
        return NextResponse.json({ ok: true });
      }
      console.error("Failed to record webhook event:", dedupError);
    }
  }

  // Create ad as pending (matches RLS with check status=pending, admin bypasses it but we keep pending for moderation)
  let adId: string;
  try {
    const { data: ad, error } = await admin
      .from("ads")
      .insert({
        user_id: config.ownerUserId,
        category_id: parsed.categoryId,
        city_id: parsed.cityId,
        description: parsed.description,
        price: parsed.price,
        province_id: parsed.provinceId,
        title: parsed.title,
        status: "pending",
        source: "telegram:pcrazor_ad",
      })
      .select("id")
      .single();

    if (error || !ad) throw error || new Error("Insert returned no id");
    adId = ad.id;
    // Link ad to webhook event for audit
    if (typeof update.update_id === "number") {
      const { error: linkError } = await admin
        .from("telegram_webhook_events")
        .update({ ad_id: adId })
        .eq("update_id", update.update_id);
      if (linkError)
        console.error("Failed to link webhook event to ad:", linkError);
    }
  } catch (error) {
    console.error("Failed to create ad from Telegram:", error);
    await sendTelegramReply(
      msg.chat.id,
      `❌ ثبت آگهی ناموفق بود: ${error instanceof Error ? error.message : "خطای نامشخص"}`,
      config.botToken,
    );
    return NextResponse.json({ ok: true });
  }

  // Handle photo: getFile → download → upload to Supabase storage → insert ad_images
  if (photoFileId) {
    try {
      const { fileUrl } = await getTelegramFileInfo(
        photoFileId,
        config.botToken,
      );
      const buffer = await downloadTelegramFile(fileUrl);

      // Determine extension from fileUrl or default to jpg
      const ext =
        fileUrl.split(".").pop()?.split("?")[0]?.toLowerCase() || "jpg";
      const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext)
        ? ext
        : "jpg";
      const storagePath = `${config.ownerUserId}/${adId}/${crypto.randomUUID()}.${safeExt}`;

      const { error: uploadError } = await admin.storage
        .from("ad-images")
        .upload(storagePath, buffer, {
          cacheControl: "31536000",
          contentType: `image/${safeExt === "jpg" ? "jpeg" : safeExt}`,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrl } = admin.storage
        .from("ad-images")
        .getPublicUrl(storagePath);

      const { error: imageError } = await admin.from("ad_images").insert({
        ad_id: adId,
        storage_path: storagePath,
        url: publicUrl.publicUrl,
        sort_order: 0,
      });

      if (imageError) {
        // Cleanup storage if DB insert fails
        await admin.storage.from("ad-images").remove([storagePath]);
        throw imageError;
      }
    } catch (error) {
      console.error("Failed to import Telegram photo:", error);
      // Don't fail the whole ad — notify user but keep ad without image
      await sendTelegramReply(
        msg.chat.id,
        `⚠️ آگهی ثبت شد اما دریافت عکس ناموفق بود: ${error instanceof Error ? error.message : "خطای عکس"}`,
        config.botToken,
      );
    }
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.rigora.ir";
  const adLink = `${siteUrl}/ads/${adId}`;
  const dashboardLink = `${siteUrl}/dashboard/ads`;

  await sendTelegramReply(
    msg.chat.id,
    `✅ آگهی از تلگرام ثبت شد\n\nعنوان: ${parsed.title}\nوضعیت: در انتظار بررسی\n\nمشاهده: ${adLink}\nمدیریت: ${dashboardLink}`,
    config.botToken,
  );

  return NextResponse.json({ ok: true });
}

// Health check for webhook (GET)
export async function GET() {
  return NextResponse.json({
    ok: true,
    webhook: "/api/telegram-webhook",
    configured: (() => {
      try {
        getTelegramWebhookConfig();
        return true;
      } catch {
        return false;
      }
    })(),
  });
}
