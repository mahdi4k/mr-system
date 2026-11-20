// `server-only` is a Next.js RSC marker that has no runtime implementation, so
// it is stubbed here to allow exercising the real senders in a Node test.
jest.mock("server-only", () => ({}), { virtual: true });

const ENV_KEYS = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "SMTP_FROM",
  "RESEND_API_KEY",
  "RESEND_FROM",
];

const saved: Record<string, string | undefined> = {};

beforeEach(() => {
  for (const key of ENV_KEYS) {
    saved[key] = process.env[key];
    delete process.env[key];
  }
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
});

const message = {
  html: "<p>سلام</p>",
  subject: "آگهی شما منتشر شد",
  text: "سلام",
  to: "seller@example.com",
};

describe("email provider selection", () => {
  it("reports no provider when nothing is configured", async () => {
    const { getEmailProvider, isEmailConfigured, sendEmail } = await import(
      "../../_lib/email/sender"
    );

    expect(getEmailProvider()).toBe("none");
    expect(isEmailConfigured()).toBe(false);
    await expect(sendEmail(message)).resolves.toMatchObject({ ok: false });
  });

  it("prefers SMTP over Resend when both are configured", async () => {
    process.env.SMTP_HOST = "smtp.gmail.com";
    process.env.SMTP_USER = "bot@gmail.com";
    process.env.SMTP_PASSWORD = "app-password";
    process.env.RESEND_API_KEY = "re_key";
    process.env.RESEND_FROM = "Rigora <no-reply@example.com>";

    const { getEmailProvider, isEmailConfigured } = await import(
      "../../_lib/email/sender"
    );

    expect(getEmailProvider()).toBe("smtp");
    expect(isEmailConfigured()).toBe(true);
  });

  it("falls back to Resend when SMTP is incomplete", async () => {
    process.env.SMTP_HOST = "smtp.gmail.com";
    process.env.RESEND_API_KEY = "re_key";
    process.env.RESEND_FROM = "Rigora <no-reply@example.com>";

    const { getEmailProvider } = await import("../../_lib/email/sender");

    expect(getEmailProvider()).toBe("resend");
  });
});

describe("email senders never throw", () => {
  it("returns a failure result when SMTP is not configured", async () => {
    const { sendSmtpEmail } = await import("../../_lib/email/sender");

    await expect(sendSmtpEmail(message)).resolves.toEqual({
      ok: false,
      error: "SMTP is not configured.",
    });
  });

  it("returns a failure result when Resend is not configured", async () => {
    const { sendResendEmail } = await import("../../_lib/email/sender");

    await expect(sendResendEmail(message)).resolves.toEqual({
      ok: false,
      error: "RESEND_API_KEY is not configured.",
    });
  });

  it("surfaces an SMTP transport error instead of rejecting", async () => {
    process.env.SMTP_HOST = "smtp.invalid";
    process.env.SMTP_PORT = "465";
    process.env.SMTP_USER = "bot@gmail.com";
    process.env.SMTP_PASSWORD = "app-password";

    const { sendSmtpEmail } = await import("../../_lib/email/sender");

    const result = await sendSmtpEmail(message);
    expect(result.ok).toBe(false);
    expect(typeof result.error).toBe("string");
    expect(result.error?.length).toBeGreaterThan(0);
  }, 30_000);

  it("surfaces a Resend transport error instead of rejecting", async () => {
    process.env.RESEND_API_KEY = "re_key";
    process.env.RESEND_FROM = "Rigora <no-reply@example.com>";

    const { sendResendEmail } = await import("../../_lib/email/sender");

    const result = await sendResendEmail(message);
    expect(result.ok).toBe(false);
    expect(typeof result.error).toBe("string");
  }, 30_000);
});
