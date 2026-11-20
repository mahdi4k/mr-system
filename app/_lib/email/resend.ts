import "server-only";
import type { EmailMessage, EmailSendResult } from "./types";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const REQUEST_TIMEOUT_MS = 10_000;

interface ResendResponse {
  id?: string;
  message?: string;
}

/**
 * Outbound email is only configured when a provider key is present. A missing key
 * is reported as "not configured" rather than an error, so publishing an ad never
 * breaks because mail is unavailable.
 */
export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM);
}

/**
 * Send one transactional email through the Resend HTTP API (no SDK dependency,
 * same shape as the Telegram notifier). Requires a domain whose TLD can receive
 * a publicly trusted certificate, so it does not work from `.ir`.
 */
export async function sendResendEmail(
  message: EmailMessage,
): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY is not configured." };
  }
  if (!from) {
    return { ok: false, error: "RESEND_FROM is not configured." };
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      body: JSON.stringify({
        from,
        html: message.html,
        subject: message.subject,
        text: message.text,
        to: [message.to],
      }),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    const result = (await response
      .json()
      .catch(() => null)) as ResendResponse | null;
    if (!response.ok) {
      return {
        ok: false,
        error: result?.message || `Email provider returned ${response.status}.`,
      };
    }
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Email request failed.",
    };
  }
}
