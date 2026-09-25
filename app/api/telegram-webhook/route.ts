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
  media_group_id?: string;
  forward_origin?: {
    type: string;
    chat?: { id: number; title?: string; username?: string; type?: string };
    sender_chat?: {
      id: number;
      title?: string;
      username?: string;
      type?: string;
    };
    sender_user_name?: string;
  };
  forward_from_chat?: {
    id: number;
    title?: string;
    username?: string;
    type?: string;
  };
  forward_sender_name?: string;
  forward_from?: { id: number; username?: string; first_name?: string };
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  // Note: we intentionally handle ONLY `message` for the forward workflow.
  // `edited_message` and `channel_post` are ignored to avoid empty/duplicate ads.
  // Webhook should be configured with allowed_updates: ["message"].
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

function isBotCommand(text: string): boolean {
  const trimmed = text.trim();
  return trimmed.startsWith("/") && /^\/\w+/.test(trimmed);
}

function extractTelegramUsername(text: string): string | null {
  // Find first @username (5-32 chars, letters, numbers, underscore) — common in channel ads like @MEPO_EF7_021
  const match = text.match(/@([A-Za-z0-9_]{5,32})/);
  return match ? match[1] : null;
}

function extractTelegramChannel(msg: TelegramMessage): string | null {
  // Try forward_origin (Bot API 7+), then legacy forward_from_chat / forward_sender_name
  const origin = msg.forward_origin;
  if (origin) {
    if (origin.chat?.title) return origin.chat.title;
    if (origin.sender_chat?.title) return origin.sender_chat.title;
    if (origin.sender_user_name) return origin.sender_user_name;
  }
  if (msg.forward_from_chat?.title) return msg.forward_from_chat.title;
  if (msg.forward_sender_name) return msg.forward_sender_name;
  if (msg.forward_from?.first_name) return msg.forward_from.first_name;
  // Fallback to username if no title
  if (origin?.chat?.username) return origin.chat.username;
  if (origin?.sender_chat?.username) return origin.sender_chat.username;
  if (msg.forward_from_chat?.username) return msg.forward_from_chat.username;
  if (msg.forward_from?.username) return msg.forward_from.username;
  return null;
}

function extractTelegramChannelUsername(msg: TelegramMessage): string | null {
  const origin = msg.forward_origin;
  if (origin?.chat?.username) return origin.chat.username;
  if (origin?.sender_chat?.username) return origin.sender_chat.username;
  if (msg.forward_from_chat?.username) return msg.forward_from_chat.username;
  if (msg.forward_from?.username) return msg.forward_from.username;
  return null;
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

  // Only handle normal messages; ignore edited_message/channel_post/callback_query/etc.
  const msg = update.message;
  if (!msg) return NextResponse.json({ ok: true });

  // Only allow your own Telegram account
  if (msg.from?.id !== config.ownerTelegramId) {
    return NextResponse.json({ ok: true });
  }

  const rawText = (msg.caption ?? msg.text ?? "").trim();
  // Biggest photo size is last element (Telegram sorts by size ascending)
  const photoFileId =
    (msg.photo?.length
      ? msg.photo[msg.photo.length - 1]?.file_id
      : undefined) ?? msg.document?.file_id;
  const mediaGroupId = msg.media_group_id;

  // Ignore bot commands like /start, /help, etc. — must NOT create an ad
  if (rawText && isBotCommand(rawText)) {
    console.log("Telegram webhook: ignoring bot command", {
      update_id: update.update_id,
      message_id: msg.message_id,
      command: rawText.slice(0, 32),
    });
    return NextResponse.json({ ok: true });
  }

  // Ignore empty messages without meaningful text and without image/document
  const hasMeaningfulText = rawText.length >= 3;
  if (!hasMeaningfulText && !photoFileId) {
    console.log("Telegram webhook: ignoring empty/irrelevant update", {
      update_id: update.update_id,
      message_id: msg.message_id,
      hasText: !!rawText,
      textLength: rawText.length,
      hasPhoto: !!msg.photo?.length,
      hasDocument: !!msg.document,
      mediaGroupId: mediaGroupId ?? null,
    });
    return NextResponse.json({ ok: true });
  }

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

  // Media group handling: Telegram sends grouped photos as separate messages with same media_group_id.
  // The first has caption, the rest have no caption. Don't create an empty ad for the rest;
  // instead, attach their photo to the ad created for the first in the group.
  if (mediaGroupId && !hasMeaningfulText && photoFileId) {
    console.log(
      "Telegram webhook: media_group without caption — trying to attach to existing ad",
      {
        update_id: update.update_id,
        message_id: msg.message_id,
        mediaGroupId,
        fileIdPrefix: photoFileId.slice(0, 8) + "...",
      },
    );
    try {
      // Find the most recent telegram ad from same owner/media group (within 2 minutes) that has <3 images
      const { data: recentAds } = await admin
        .from("ads")
        .select("id, created_at")
        .eq("user_id", config.ownerUserId)
        .eq("source", "telegram:pcrazor_ad")
        .order("created_at", { ascending: false })
        .limit(5);
      let targetAdId: string | null = null;
      if (recentAds) {
        for (const candidate of recentAds) {
          const ageMs = Date.now() - new Date(candidate.created_at).getTime();
          if (ageMs > 120_000) continue; // older than 2 minutes, ignore
          const { data: existingImages } = await admin
            .from("ad_images")
            .select("id")
            .eq("ad_id", candidate.id);
          if ((existingImages?.length ?? 0) < 3) {
            targetAdId = candidate.id;
            break;
          }
        }
      }
      if (targetAdId) {
        // Attach this photo to that ad
        try {
          const { filePath, fileUrl } = await getTelegramFileInfo(
            photoFileId,
            config.botToken,
          );
          const { buffer, contentType, byteLength } =
            await downloadTelegramFile(fileUrl);
          if (byteLength === 0) throw new Error("Empty download");
          const extFromPath =
            filePath.split(".").pop()?.split("?")[0]?.toLowerCase() || "jpg";
          const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(
            extFromPath,
          )
            ? extFromPath
            : "jpg";
          const { data: existing } = await admin
            .from("ad_images")
            .select("sort_order")
            .eq("ad_id", targetAdId)
            .order("sort_order");
          const nextOrder = existing?.length ?? 0;
          if (nextOrder >= 3) {
            console.log(
              "Telegram webhook: target ad already has 3 images, ignoring extra",
              { targetAdId },
            );
            return NextResponse.json({ ok: true });
          }
          const storagePath = `${config.ownerUserId}/${targetAdId}/${crypto.randomUUID()}.${safeExt}`;
          const { error: uploadError } = await admin.storage
            .from("ad-images")
            .upload(storagePath, buffer, {
              cacheControl: "31536000",
              contentType: `image/${safeExt === "jpg" ? "jpeg" : safeExt}`,
              upsert: false,
            });
          if (uploadError)
            throw new Error(`Storage upload failed: ${uploadError.message}`);
          const { data: publicUrl } = admin.storage
            .from("ad-images")
            .getPublicUrl(storagePath);
          const { error: imageError } = await admin.from("ad_images").insert({
            ad_id: targetAdId,
            storage_path: storagePath,
            url: publicUrl.publicUrl,
            sort_order: nextOrder,
          });
          if (imageError) {
            await admin.storage.from("ad-images").remove([storagePath]);
            throw new Error(`ad_images insert failed: ${imageError.message}`);
          }
          console.log(
            "Telegram webhook: attached media_group photo to existing ad",
            {
              targetAdId,
              update_id: update.update_id,
              byteLength,
              contentType,
            },
          );
          // Also update debug if exists
          try {
            await admin.from("telegram_webhook_debug").insert({
              update_id: update.update_id,
              message_id: msg.message_id,
              chat_id: msg.chat.id,
              has_photo: true,
              photo_count: msg.photo?.length ?? 0,
              file_id_prefix: photoFileId.slice(0, 8),
              file_path: filePath,
              download_bytes: byteLength,
              download_content_type: contentType,
              media_group_id: mediaGroupId,
            });
          } catch {}
          return NextResponse.json({ ok: true });
        } catch (e) {
          console.error(
            "Telegram webhook: failed to attach media_group photo",
            {
              targetAdId,
              error: e instanceof Error ? e.message : String(e),
            },
          );
          // Fall through to ignore empty ad (don't create new)
          return NextResponse.json({ ok: true });
        }
      } else {
        console.log(
          "Telegram webhook: no recent ad found for media_group, ignoring empty",
          {
            mediaGroupId,
            update_id: update.update_id,
          },
        );
        return NextResponse.json({ ok: true });
      }
    } catch (e) {
      console.error("Telegram webhook: media_group handling failed", e);
      return NextResponse.json({ ok: true });
    }
  }

  console.log("Telegram webhook: received message", {
    update_id: update.update_id,
    message_id: msg.message_id,
    chat_id: msg.chat.id,
    hasPhoto: !!msg.photo?.length,
    photoCount: msg.photo?.length ?? 0,
    hasDocument: !!msg.document,
    hasText: !!rawText,
    textLength: rawText.length,
    photoFileIdPrefix: photoFileId ? photoFileId.slice(0, 8) + "..." : null,
    mediaGroupId: mediaGroupId ?? null,
  });

  const effectiveText = rawText || "آگهی تلگرام";
  const parsed = parseTelegramAdContent(effectiveText);
  const telegramChannel = extractTelegramChannel(msg);
  const telegramChannelUsername = extractTelegramChannelUsername(msg);
  const telegramUsername = extractTelegramUsername(rawText);
  // For pcrazor_ad channel, ensure it resolves to https://t.me/pcrazor_ad
  // If forward is from pcrazor_ad, channel username will be pcrazor_ad; fallback to that if no @ in text
  const resolvedChannelUsername = telegramChannelUsername || null;

  // Hard fallback for your main channel if forward info is hidden (e.g. XX)
  const finalChannelUsername =
    resolvedChannelUsername ||
    (telegramChannel === "XX" ? "pcrazor_ad" : resolvedChannelUsername);

  console.log("Telegram webhook: extracted channel info", {
    telegramChannel,
    telegramChannelUsername,
    telegramUsername,
    hasAtMention: !!telegramUsername,
    resolvedChannelUsername: finalChannelUsername,
  });

  // Debug: persist safe payload diagnostics for image troubleshooting (no secrets)
  try {
    await admin.from("telegram_webhook_debug").insert({
      update_id: update.update_id,
      message_id: msg.message_id,
      chat_id: msg.chat.id,
      has_photo: !!msg.photo?.length,
      photo_count: msg.photo?.length ?? 0,
      has_document: !!msg.document,
      has_text: !!msg.text,
      has_caption: !!msg.caption,
      text_length: msg.text?.length ?? 0,
      caption_length: msg.caption?.length ?? 0,
      file_id_prefix: photoFileId ? photoFileId.slice(0, 8) : null,
      raw_has_photo_key: "photo" in msg,
      media_group_id: mediaGroupId ?? null,
    });
  } catch (e) {
    console.error("Telegram webhook: debug insert failed (non-blocking)", e);
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
    let insertError: unknown = null;
    let ad: { id: string } | null = null;
    // Try with new telegram columns, fallback to without them if migration not yet applied
    const tryInsert = async (withTelegramFields: boolean) => {
      const payload: Record<string, unknown> = {
        user_id: config.ownerUserId,
        category_id: parsed.categoryId,
        city_id: parsed.cityId,
        description: parsed.description,
        price: parsed.price,
        province_id: parsed.provinceId,
        title: parsed.title,
        status: "pending",
        source: "telegram:pcrazor_ad",
      };
      if (withTelegramFields) {
        payload.telegram_channel = telegramChannel;
        payload.telegram_channel_username = finalChannelUsername;
        payload.telegram_username = telegramUsername;
        // Hard fix for XX placeholder channel -> force pcrazor_ad
        if (telegramChannel === "XX" && !payload.telegram_channel_username) {
          payload.telegram_channel_username = "pcrazor_ad";
        }
        if (telegramChannel === "XX") {
          payload.telegram_channel = "pcrazor_ad";
        }
      }
      const res = await admin
        .from("ads")
        .insert(payload as never)
        .select("id")
        .single();
      return res;
    };

    let res = await tryInsert(true);
    if (res.error && String(res.error.message).includes("column")) {
      console.warn(
        "Telegram webhook: telegram_channel columns missing, retrying without them",
        res.error.message,
      );
      res = await tryInsert(false);
    }
    const data = res.data as { id: string } | null;
    const error = res.error as unknown as { message: string } | null;
    ad = data;
    insertError = error;

    if (insertError || !ad)
      throw (
        (insertError as unknown as Error) || new Error("Insert returned no id")
      );
    adId = (ad as { id: string }).id;
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
  // Flow: Telegram photo[] (highest res) → getFile → file URL → download → Supabase Storage ad-images → ad_images
  if (photoFileId) {
    try {
      console.log("Telegram webhook: processing photo - step getFile", {
        adId,
        update_id: update.update_id,
        message_id: msg.message_id,
        fileIdPrefix: photoFileId.slice(0, 8) + "...",
        photoCount: msg.photo?.length ?? 0,
      });
      const { filePath, fileUrl } = await getTelegramFileInfo(
        photoFileId,
        config.botToken,
      );
      console.log("Telegram webhook: getFile success", {
        adId,
        filePath,
      });
      try {
        await admin
          .from("telegram_webhook_debug")
          .update({ file_path: filePath })
          .eq("update_id", update.update_id);
      } catch {}

      const downloadResult = await downloadTelegramFile(fileUrl);
      const { buffer, contentType, status, byteLength } = downloadResult;
      console.log("Telegram webhook: download success", {
        adId,
        status,
        contentType,
        byteLength,
        filePath,
      });
      try {
        await admin
          .from("telegram_webhook_debug")
          .update({
            download_status: status,
            download_content_type: contentType,
            download_bytes: byteLength,
          })
          .eq("update_id", update.update_id);
      } catch {}

      if (byteLength === 0) {
        throw new Error(
          `Downloaded file is empty (status=${status} content-type=${contentType ?? "unknown"} byteLength=0)`,
        );
      }
      if (contentType && !contentType.startsWith("image/")) {
        console.warn("Telegram webhook: downloaded content-type is not image", {
          adId,
          contentType,
          byteLength,
        });
        // Still attempt upload as image; Telegram usually returns image/jpeg
      }

      // Determine extension from Telegram filePath (not from token-containing URL for safety)
      const extFromPath =
        filePath.split(".").pop()?.split("?")[0]?.toLowerCase() || "jpg";
      const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(
        extFromPath,
      )
        ? extFromPath
        : "jpg";
      const storagePath = `${config.ownerUserId}/${adId}/${crypto.randomUUID()}.${safeExt}`;

      // Supabase Storage expects Blob/Buffer; use Buffer directly (Node) with explicit contentType
      const { error: uploadError } = await admin.storage
        .from("ad-images")
        .upload(storagePath, buffer, {
          cacheControl: "31536000",
          contentType: `image/${safeExt === "jpg" ? "jpeg" : safeExt}`,
          upsert: false,
        });

      if (uploadError) {
        console.error("Telegram webhook: Supabase Storage upload failed", {
          adId,
          storagePath,
          byteLength,
          contentType,
          errorCode: (uploadError as { statusCode?: string })?.statusCode,
          errorMessage: uploadError.message,
        });
        try {
          await admin
            .from("telegram_webhook_debug")
            .update({ storage_error: uploadError.message.slice(0, 500) })
            .eq("update_id", update.update_id);
        } catch {}
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }
      console.log("Telegram webhook: Storage upload success", {
        adId,
        storagePath,
        byteLength,
      });

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
        console.error("Telegram webhook: ad_images insert failed", {
          adId,
          storagePath,
          errorCode: (imageError as { code?: string })?.code,
          errorMessage: imageError.message,
        });
        try {
          await admin
            .from("telegram_webhook_debug")
            .update({ image_error: imageError.message.slice(0, 500) })
            .eq("update_id", update.update_id);
        } catch {}
        // Cleanup storage if DB insert fails
        await admin.storage.from("ad-images").remove([storagePath]);
        throw new Error(`ad_images insert failed: ${imageError.message}`);
      }
      console.log("Telegram webhook: ad_images insert success", {
        adId,
        storagePath,
      });
      try {
        await admin
          .from("telegram_webhook_debug")
          .update({ image_error: null, storage_error: null })
          .eq("update_id", update.update_id);
      } catch {}
    } catch (error) {
      const safeMessage = error instanceof Error ? error.message : "خطای عکس";
      // Never log botToken/fileUrl; only safe diagnostics already logged above
      console.error("Telegram webhook: image processing failed (ad kept)", {
        adId,
        update_id: update.update_id,
        message_id: msg.message_id,
        fileIdPrefix: photoFileId.slice(0, 8) + "...",
        error: safeMessage,
      });
      try {
        await admin
          .from("telegram_webhook_debug")
          .update({ image_error: safeMessage.slice(0, 500) })
          .eq("update_id", update.update_id);
      } catch {}
      // Keep the ad, but make Telegram response clearly indicate failure
      await sendTelegramReply(
        msg.chat.id,
        `⚠️ آگهی ثبت شد اما دریافت عکس ناموفق بود`,
        config.botToken,
      );
    }
  } else {
    console.log("Telegram webhook: no photo to process", {
      adId,
      update_id: update.update_id,
    });
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
