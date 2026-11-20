import "server-only";
import dns from "node:dns";
import net from "node:net";
import nodemailer, { type Transporter } from "nodemailer";
import type { EmailMessage, EmailSendResult } from "./types";

const CONNECTION_TIMEOUT_MS = 10_000;
const SOCKET_TIMEOUT_MS = 20_000;
const IPV4_CACHE_TTL_MS = 5 * 60 * 1000;

export function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD,
  );
}

/**
 * Google displays an App Password as four groups of four characters and the code
 * often gets pasted with those spaces still in it, which the server rejects as
 * invalid login. Strip every whitespace character before authenticating.
 */
function normalizeSecret(value: string | undefined): string {
  return (value ?? "").replace(/\s+/g, "");
}

/**
 * Nodemailer resolves A and AAAA records and then picks one address at random, so
 * a host that answers on IPv6 DNS but has no working IPv6 route fails on roughly
 * half of all connection attempts. Resolving A records directly makes delivery
 * deterministic. Set SMTP_FORCE_IPV4=false to opt out on a network that is
 * genuinely IPv6-only.
 */
function shouldForceIpv4(): boolean {
  return process.env.SMTP_FORCE_IPV4 !== "false";
}

let ipv4Cache: { addresses: string[]; expires: number } | undefined;

async function resolveIpv4(hostname: string): Promise<string | undefined> {
  if (!hostname) return undefined;
  if (net.isIP(hostname)) return hostname;

  if (
    ipv4Cache &&
    ipv4Cache.expires > Date.now() &&
    ipv4Cache.addresses.length
  ) {
    return pickRandom(ipv4Cache.addresses);
  }
  try {
    const addresses = await dns.promises.resolve4(hostname);
    if (!addresses.length) return undefined;
    ipv4Cache = { addresses, expires: Date.now() + IPV4_CACHE_TTL_MS };
    return pickRandom(addresses);
  } catch {
    return undefined;
  }
}

function pickRandom(addresses: string[]): string {
  return addresses[Math.floor(Math.random() * addresses.length)];
}

let transporter: Transporter | undefined;
let transporterKey: string | undefined;

/**
 * The transport is cached per configuration so repeated publishes reuse one
 * connection instead of re-handshaking TLS on every ad.
 */
async function getTransporter(): Promise<Transporter> {
  const hostname = process.env.SMTP_HOST ?? "";
  const user = process.env.SMTP_USER ?? "";
  const port = Number(process.env.SMTP_PORT ?? 465);
  const password = normalizeSecret(process.env.SMTP_PASSWORD);
  const connectionHost = shouldForceIpv4()
    ? ((await resolveIpv4(hostname)) ?? hostname)
    : hostname;
  const key = `${connectionHost}:${port}:${user}`;
  if (transporter && transporterKey === key) return transporter;

  transporter = nodemailer.createTransport({
    // Port 465 is implicit TLS; 587 upgrades with STARTTLS.
    secure: process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE === "true"
      : port === 465,
    auth: { pass: password, user },
    connectionTimeout: CONNECTION_TIMEOUT_MS,
    host: connectionHost,
    pool: true,
    port,
    // Keeps SNI and certificate validation pointed at the real hostname even
    // though the socket is opened against a resolved IPv4 address.
    servername: net.isIP(hostname) ? undefined : hostname,
    socketTimeout: SOCKET_TIMEOUT_MS,
  });
  transporterKey = key;
  return transporter;
}

function fromAddress(): string {
  return process.env.SMTP_FROM || process.env.SMTP_USER || "";
}

/**
 * Send one transactional email over SMTP. Works with a Gmail app password out of
 * the box, which is the practical option for a `.ir` sending domain that no
 * public CA can certify.
 */
export async function sendSmtpEmail(
  message: EmailMessage,
): Promise<EmailSendResult> {
  if (!isSmtpConfigured()) {
    return { ok: false, error: "SMTP is not configured." };
  }
  const from = fromAddress();
  if (!from) {
    return { ok: false, error: "SMTP_FROM is missing." };
  }

  try {
    const smtp = await getTransporter();
    await smtp.sendMail({
      from,
      html: message.html,
      subject: message.subject,
      text: message.text,
      to: message.to,
    });
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "SMTP request failed.",
    };
  }
}
