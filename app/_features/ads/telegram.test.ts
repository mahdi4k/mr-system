import fs from "node:fs";
import path from "node:path";
import { formatTelegramAdMessage } from "./telegram";

describe("Telegram ad notifications", () => {
  it("formats a pending ad with price and moderation links", () => {
    const message = formatTelegramAdMessage({
      adId: "123e4567-e89b-42d3-a456-426614174000",
      price: 12500000,
      seller: "Mahdi",
      siteUrl: "https://rigora.example/",
      title: "RTX 3060",
    });

    expect(message).toContain("آگهی جدید در ریگورا");
    expect(message).toContain("۱۲٬۵۰۰٬۰۰۰ تومان");
    expect(message).toContain("فروشنده: Mahdi");
    expect(message).toContain(
      "https://rigora.example/ads/123e4567-e89b-42d3-a456-426614174000",
    );
    expect(message).toContain("https://rigora.example/dashboard/ads");
    expect(message).not.toContain("https://rigora.example//ads");
  });

  it("labels an ad without a price as negotiable", () => {
    expect(
      formatTelegramAdMessage({
        adId: "123e4567-e89b-42d3-a456-426614174000",
        price: null,
        seller: "کاربر",
        siteUrl: "https://rigora.example",
        title: "CPU",
      }),
    ).toContain("قیمت: توافقی");
  });

  it("protects notification state and authenticates the API request", () => {
    const migration = fs.readFileSync(
      path.join(
        process.cwd(),
        "supabase/migrations/20260814010000_telegram_ad_notifications.sql",
      ),
      "utf8",
    );
    const route = fs.readFileSync(
      path.join(process.cwd(), "app/api/ads/[id]/notify/route.ts"),
      "utf8",
    );

    expect(migration).toContain("ads_protect_notification_fields");
    expect(migration).toContain("<> 'service_role'");
    expect(route).toContain("supabase.auth.getUser()");
    expect(route).toContain("ad.user_id !== user.id");
    expect(route).toContain('ad.status !== "pending"');
    expect(route).not.toContain("NEXT_PUBLIC_TELEGRAM");
  });
});
