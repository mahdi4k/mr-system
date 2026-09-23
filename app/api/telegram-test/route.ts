import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Vercel connectivity test — does NOT expose bot token, webhook secret, or Supabase keys.
// Verifies that the Vercel server can reach Telegram's API (required for getFile/download).
// The image download happens on Vercel, not on your Ubuntu proxy (127.0.0.1:10808 is irrelevant).

export async function GET(req: Request) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const webhookSecret = process.env.TG_WEBHOOK_SECRET;
  const ownerTelegramId =
    process.env.MY_TELEGRAM_ID || process.env.TELEGRAM_ADMIN_CHAT_ID;
  const ownerUserId = process.env.TELEGRAM_OWNER_USER_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const envCheck = {
    hasBotToken: !!botToken,
    hasWebhookSecret: !!webhookSecret,
    hasOwnerTelegramId: !!ownerTelegramId,
    hasOwnerUserId: !!ownerUserId,
    siteUrl: siteUrl || null,
    siteUrlIsWww: siteUrl === "https://www.rigora.ir",
  };

  const { searchParams } = new URL(req.url);
  const testFileId = searchParams.get("file_id");
  if (testFileId && botToken) {
    // Vercel file download test (safe diagnostics, no token exposed)
    try {
      const getFileRes = await fetch(
        `https://api.telegram.org/bot${botToken}/getFile?file_id=${encodeURIComponent(testFileId)}`,
        { signal: AbortSignal.timeout(8000) },
      );
      const getFileData = (await getFileRes.json().catch(() => null)) as {
        ok?: boolean;
        result?: { file_path: string };
        description?: string;
      } | null;
      if (
        !getFileRes.ok ||
        !getFileData?.ok ||
        !getFileData.result?.file_path
      ) {
        return NextResponse.json({
          ok: false,
          test: "file_download",
          getFile: {
            status: getFileRes.status,
            contentType: getFileRes.headers.get("content-type"),
            error: getFileData?.description || `HTTP ${getFileRes.status}`,
          },
        });
      }
      const filePath = getFileData.result.file_path;
      const fileUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;
      const dlRes = await fetch(fileUrl, {
        signal: AbortSignal.timeout(15000),
      });
      const contentType = dlRes.headers.get("content-type");
      const status = dlRes.status;
      if (!dlRes.ok) {
        return NextResponse.json({
          ok: false,
          test: "file_download",
          filePath,
          status,
          contentType,
          error: `Download HTTP ${status}`,
        });
      }
      const buf = await dlRes.arrayBuffer();
      return NextResponse.json({
        ok: true,
        test: "file_download",
        filePath,
        status,
        contentType,
        byteLength: buf.byteLength,
        note: "Vercel can reach Telegram file API; image download should work. If byteLength 0 or status !=200, that's the blocker.",
      });
    } catch (e) {
      return NextResponse.json({
        ok: false,
        test: "file_download",
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  // Test 1: Can Vercel reach Telegram API? (getMe — does not need file, just token)
  let telegramReachable: boolean | null = null;
  let telegramStatus: number | null = null;
  let telegramContentType: string | null = null;
  let telegramError: string | null = null;

  if (!botToken) {
    telegramError = "Missing TELEGRAM_BOT_TOKEN env";
  } else {
    try {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/getMe`, {
        signal: AbortSignal.timeout(8000),
      });
      telegramStatus = res.status;
      telegramContentType = res.headers.get("content-type");
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        description?: string;
      } | null;
      telegramReachable = res.ok && !!data?.ok;
      if (!telegramReachable) {
        telegramError = data?.description || `HTTP ${res.status}`;
      }
    } catch (e) {
      telegramError = e instanceof Error ? e.message : String(e);
      telegramReachable = false;
    }
  }

  // Test 2: Can Vercel reach Supabase? (ad-images bucket list)
  let supabaseReachable: boolean | null = null;
  let supabaseError: string | null = null;
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !anonKey) {
      supabaseError = "Missing Supabase env";
    } else {
      const res = await fetch(
        `${url}/rest/v1/ad_categories?select=id&limit=1`,
        {
          headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
          signal: AbortSignal.timeout(8000),
        },
      );
      supabaseReachable = res.ok;
      if (!res.ok) supabaseError = `HTTP ${res.status}`;
    }
  } catch (e) {
    supabaseError = e instanceof Error ? e.message : String(e);
    supabaseReachable = false;
  }

  return NextResponse.json({
    ok: telegramReachable && supabaseReachable && envCheck.hasBotToken,
    envCheck,
    telegram: {
      reachable: telegramReachable,
      status: telegramStatus,
      contentType: telegramContentType,
      error: telegramError,
      // Note: If reachable is false, image download on Vercel will fail.
      // Your local 127.0.0.1:10808 proxy is irrelevant — this test runs on Vercel.
    },
    supabase: {
      reachable: supabaseReachable,
      error: supabaseError,
    },
    note: "If telegram.reachable is false, Vercel cannot reach Telegram file API — this is the image blocker. Do not change local proxy; fix Vercel env/network.",
  });
}
