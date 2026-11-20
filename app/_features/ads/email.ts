export interface PublishedAdEmailInput {
  adId: string;
  recipientName: string;
  siteUrl: string;
  title: string;
}

export interface RenderedEmail {
  html: string;
  subject: string;
  text: string;
}

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * The ad title and the display name are user supplied, so they are escaped before
 * they reach the HTML body.
 */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => HTML_ESCAPES[character]);
}

function normalizeSiteUrl(siteUrl: string): string {
  return siteUrl.replace(/\/+$/, "");
}

export function buildAdUrl(siteUrl: string, adId: string): string {
  return `${normalizeSiteUrl(siteUrl)}/ads/${adId}`;
}

export function formatPublishedAdEmail({
  adId,
  recipientName,
  siteUrl,
  title,
}: PublishedAdEmailInput): RenderedEmail {
  const safeTitle = escapeHtml(title);
  const safeName = escapeHtml(recipientName || "کاربر ریگورا");
  const adUrl = buildAdUrl(siteUrl, adId);
  const subject = `آگهی شما منتشر شد: ${title}`;

  const text = [
    `${recipientName || "کاربر ریگورا"} عزیز،`,
    "",
    `آگهی «${title}» پس از بررسی و تأیید تیم ریگورا منتشر شد.`,
    "اکنون آگهی شما در بخش آگهی‌های سایت و صفحه اصلی قابل مشاهده است.",
    "",
    "مشاهده آگهی:",
    adUrl,
    "",
    "مدیریت آگهی‌های من:",
    `${normalizeSiteUrl(siteUrl)}/profile/ads`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="fa" dir="rtl">
  <body style="margin:0;padding:24px;background:#f4f5f7;font-family:Tahoma,Arial,sans-serif;color:#1f2933;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;border:1px solid #e4e7eb;">
      <tr>
        <td style="padding:24px;">
          <p style="margin:0 0 16px;font-size:16px;">${safeName} عزیز،</p>
          <h1 style="margin:0 0 16px;font-size:20px;line-height:1.7;">
            آگهی شما با موفقیت منتشر شد
          </h1>
          <p style="margin:0 0 8px;font-size:15px;line-height:2;">
            آگهی «${safeTitle}» پس از بررسی و تأیید تیم ریگورا در سایت منتشر شد.
          </p>
          <p style="margin:0 0 24px;font-size:14px;line-height:2;color:#52606d;">
            اکنون آگهی شما در بخش آگهی‌های سایت و صفحه اصلی برای همه قابل مشاهده است.
          </p>
          <p style="margin:0 0 28px;">
            <a href="${adUrl}" style="display:inline-block;padding:12px 22px;background:#5a8a00;color:#ffffff;text-decoration:none;border-radius:8px;font-size:15px;font-weight:bold;">
              مشاهده آگهی
            </a>
          </p>
          <p style="margin:0;font-size:13px;line-height:2;color:#52606d;">
            برای ویرایش یا بایگانی کردن آگهی، به بخش «آگهی‌های من» در پروفایل خود مراجعه کنید.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px;border-top:1px solid #e4e7eb;font-size:12px;color:#7b8794;">
          این پیام به‌صورت خودکار از سوی ریگورا ارسال شده است.
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { html, subject, text };
}
