import fs from "node:fs";
import path from "node:path";
import { buildAdUrl, escapeHtml, formatPublishedAdEmail } from "./email";

const AD_ID = "123e4567-e89b-42d3-a456-426614174000";

describe("published ad email", () => {
  const email = formatPublishedAdEmail({
    adId: AD_ID,
    recipientName: "مهدی",
    siteUrl: "https://rigora.example/",
    title: "RTX 3060",
  });

  it("announces the publication with the ad link", () => {
    expect(email.subject).toContain("RTX 3060");
    expect(email.subject).toContain("منتشر شد");
    expect(email.text).toContain("آگهی «RTX 3060»");
    expect(email.text).toContain(`https://rigora.example/ads/${AD_ID}`);
    expect(email.html).toContain(`href="https://rigora.example/ads/${AD_ID}"`);
  });

  it("renders a right-to-left document", () => {
    expect(email.html).toContain('dir="rtl"');
    expect(email.html).toContain('lang="fa"');
  });

  it("never doubles the site url slash", () => {
    expect(buildAdUrl("https://rigora.example///", AD_ID)).toBe(
      `https://rigora.example/ads/${AD_ID}`,
    );
    expect(email.text).toContain("https://rigora.example/profile/ads");
  });

  it("escapes user supplied values in the html body", () => {
    const injected = formatPublishedAdEmail({
      adId: AD_ID,
      recipientName: "<script>alert(1)</script>",
      siteUrl: "https://rigora.example",
      title: 'GPU "<img src=x onerror=alert(1)>"',
    });

    expect(injected.html).not.toContain("<script>");
    expect(injected.html).not.toContain("<img src=x");
    expect(injected.html).toContain("&lt;script&gt;");
    expect(injected.html).toContain("&quot;");
    // The plain text part stays readable, it is not rendered as html.
    expect(injected.text).toContain("<script>");
  });

  it("falls back to a generic greeting without a display name", () => {
    expect(
      formatPublishedAdEmail({
        adId: AD_ID,
        recipientName: "",
        siteUrl: "https://rigora.example",
        title: "CPU",
      }).text,
    ).toContain("کاربر ریگورا عزیز");
  });

  it("escapes every html metacharacter", () => {
    expect(escapeHtml(`&<>"'`)).toBe("&amp;&lt;&gt;&quot;&#39;");
    expect(escapeHtml("plain")).toBe("plain");
  });
});

describe("published ad email plumbing", () => {
  const migration = fs.readFileSync(
    path.join(
      process.cwd(),
      "supabase/migrations/20260927000000_ad_published_email.sql",
    ),
    "utf8",
  );
  const publishRoute = fs.readFileSync(
    path.join(process.cwd(), "app/api/dashboard/ads/[id]/publish/route.ts"),
    "utf8",
  );
  const sender = fs.readFileSync(
    path.join(process.cwd(), "app/_lib/email/sender.ts"),
    "utf8",
  );
  const smtp = fs.readFileSync(
    path.join(process.cwd(), "app/_lib/email/smtp.ts"),
    "utf8",
  );
  const resend = fs.readFileSync(
    path.join(process.cwd(), "app/_lib/email/resend.ts"),
    "utf8",
  );
  const adsApi = fs.readFileSync(
    path.join(process.cwd(), "app/_redux/services/adsApi.ts"),
    "utf8",
  );
  const adsClient = fs.readFileSync(
    path.join(process.cwd(), "app/(routes)/dashboard/ads/clientAds.tsx"),
    "utf8",
  );

  it("records the notification server side only", () => {
    expect(migration).toContain(
      "add column if not exists publication_notified_at timestamptz",
    );
    expect(migration).toContain(
      "new.publication_notified_at is distinct from old.publication_notified_at",
    );
    expect(migration).toContain(
      "coalesce((select auth.role()), '') <> 'service_role'",
    );
  });

  it("requires an administrator session", () => {
    expect(publishRoute).toContain("getAdminSession()");
    expect(publishRoute).toContain('return failure("Unauthorized", 401)');
    expect(publishRoute).toContain("UUID_PATTERN.test(id)");
  });

  it("publishes and notifies in one request so mail cannot be skipped", () => {
    expect(publishRoute).toContain('.update({ status: "published" })');
    expect(publishRoute).toContain('.neq("status", "published")');
    expect(publishRoute).toContain("formatPublishedAdEmail");
    expect(publishRoute).toContain("sendEmail");
    expect(adsApi).toContain("/api/dashboard/ads/${id}/publish");
    expect(adsApi).not.toContain('moderateAd(id, "published")');
  });

  it("reads the owner email from the profile and skips the mail when absent", () => {
    expect(publishRoute).toContain(
      "profiles!ads_user_id_fkey(display_name, email)",
    );
    expect(publishRoute).toContain("if (!recipient)");
  });

  it("keeps the ad published even when the email fails", () => {
    expect(publishRoute).toContain("The ad stays published");
    expect(publishRoute).toContain("recordNotification(admin, id)");
    // A failed send is a warning on a successful publish, never a 502 that
    // tells the moderator their publish failed.
    expect(publishRoute).toContain("warning: EMAIL_WARNING");
    expect(publishRoute).not.toContain("{ status: 502 }");
    expect(adsApi).toContain("{ warning: body.warning }");
    expect(adsClient).toContain("result?.warning");
    expect(adsClient).toContain('color: "orange"');
  });

  it("never lets the bookkeeping column block a publication", () => {
    // The notification migration may not be applied yet, so the load query must
    // not select publication_notified_at and the stamp must be best effort.
    expect(publishRoute).not.toContain("status, publication_notified_at,");
    expect(publishRoute).toContain("async function recordNotification");
    expect(publishRoute).toContain("20260927000000_ad_published_email.sql");
  });

  it("keeps every provider key server only", () => {
    for (const module of [sender, smtp, resend]) {
      expect(module).toContain('import "server-only"');
      expect(module).not.toContain("NEXT_PUBLIC_RESEND");
      expect(module).not.toContain("NEXT_PUBLIC_SMTP");
    }
  });

  it("prefers SMTP because a .ir domain cannot be verified by any provider", () => {
    expect(sender).toContain('if (isSmtpConfigured()) return "smtp"');
    expect(sender).toContain('if (isResendConfigured()) return "resend"');
    expect(smtp).toContain("SMTP_HOST");
    expect(smtp).toContain("SMTP_USER");
    expect(smtp).toContain("SMTP_PASSWORD");
    expect(smtp).toContain("SMTP_FROM");
    expect(smtp).toContain("pool: true");
  });

  it("reuses one transporter instead of handshaking per email", () => {
    expect(smtp).toContain("let transporter: Transporter | undefined");
    expect(smtp).toContain("if (transporter && transporterKey === key)");
  });

  it("pins IPv4 while keeping TLS validation on the real hostname", () => {
    // Nodemailer picks a random address between the A and AAAA records, so a host
    // that answers on IPv6 DNS but has no IPv6 route fails about half the time.
    expect(smtp).toContain("dns.promises.resolve4(hostname)");
    expect(smtp).toContain("SMTP_FORCE_IPV4");
    expect(smtp).toContain("host: connectionHost");
    expect(smtp).toContain(
      "servername: net.isIP(hostname) ? undefined : hostname",
    );
  });

  it("strips the spaces Google puts in an app password", () => {
    expect(smtp).toContain('(value ?? "").replace(/\\s+/g, "")');
    expect(smtp).toContain("auth: { pass: password, user }");
  });

  it("reports a missing configuration instead of throwing", () => {
    expect(smtp).toContain('error: "SMTP is not configured."');
    expect(sender).toContain("ok: false,");
    expect(sender).toContain("Add SMTP_HOST/SMTP_USER/SMTP_PASSWORD");
  });

  it("surfaces the provider in server logs", () => {
    expect(
      fs.readFileSync(
        path.join(process.cwd(), "app/api/dashboard/ads/[id]/publish/route.ts"),
        "utf8",
      ),
    ).toContain("getEmailProvider()");
  });
});
