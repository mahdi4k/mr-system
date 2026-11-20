export interface EmailMessage {
  html: string;
  subject: string;
  text: string;
  to: string;
}

export interface EmailSendResult {
  error?: string;
  ok: boolean;
}
