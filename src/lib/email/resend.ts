import { Resend } from "resend";

interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  leadId?: string; // List-Unsubscribe ヘッダー用
}

interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  return new Resend(apiKey);
}

export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (!fromEmail) {
    return { success: false, error: "RESEND_FROM_EMAIL is not configured" };
  }

  try {
    const resend = getResendClient();

    // List-Unsubscribe ヘッダー
    const headers: Record<string, string> = {};
    if (params.leadId) {
      const unsubUrl = `${siteUrl}/api/unsubscribe?lead_id=${params.leadId}`;
      headers["List-Unsubscribe"] = `<${unsubUrl}>`;
      headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
    }

    const { data, error } = await resend.emails.send({
      from: `オンラインバックオフィス代行 <${fromEmail}>`,
      to: params.to,
      subject: params.subject,
      text: params.text,
      headers: Object.keys(headers).length > 0 ? headers : undefined,
    });

    if (error) {
      console.error("[Email] Send failed:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("[Email] Exception:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
