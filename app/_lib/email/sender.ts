import "server-only";
import { isSmtpConfigured, sendSmtpEmail } from "./smtp";
import { isResendConfigured, sendResendEmail } from "./resend";
import type { EmailMessage, EmailSendResult } from "./types";

export type { EmailMessage, EmailSendResult };
export { isSmtpConfigured, sendSmtpEmail } from "./smtp";
export { isResendConfigured, sendResendEmail } from "./resend";

export type EmailProvider = "smtp" | "resend" | "none";

/**
 * SMTP is preferred because it needs no verified domain, which is what makes it
 * usable from a `.ir` address. Resend stays as the faster path once a domain
 * with publicly issuable certificates is available.
 */
export function getEmailProvider(): EmailProvider {
  if (isSmtpConfigured()) return "smtp";
  if (isResendConfigured()) return "resend";
  return "none";
}

export function isEmailConfigured(): boolean {
  return getEmailProvider() !== "none";
}

export async function sendEmail(
  message: EmailMessage,
): Promise<EmailSendResult> {
  const provider = getEmailProvider();
  if (provider === "smtp") return sendSmtpEmail(message);
  if (provider === "resend") return sendResendEmail(message);
  return {
    ok: false,
    error:
      "Email is not configured. Add SMTP_HOST/SMTP_USER/SMTP_PASSWORD (or RESEND_API_KEY/RESEND_FROM) to .env.local.",
  };
}
