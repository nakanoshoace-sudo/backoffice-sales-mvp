import { sendEmail } from "@/lib/email/resend";
import { EMAIL_TEMPLATES } from "@/lib/email/templates";

interface Day0EmailParams {
  lead_id: string;
  person_name: string;
  company_name: string;
  email: string;
}

export async function sendDay0Email(params: Day0EmailParams): Promise<void> {
  const template = EMAIL_TEMPLATES.find((t) => t.key === "day_0_thanks");
  if (!template) {
    console.error("[Day0Email] Template not found: day_0_thanks");
    return;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://backoffice-sales-mvp.vercel.app";
  const bookingUrl = `${siteUrl}/book`;
  const unsubscribeUrl = `${siteUrl}/unsubscribe?lead_id=${params.lead_id}`;

  const body = template.body({
    person_name: params.person_name,
    company_name: params.company_name,
    booking_url: bookingUrl,
    unsubscribe_url: unsubscribeUrl,
  });

  await sendEmail({
    to: params.email,
    subject: template.subject,
    text: body,
  });

  console.log(`[Day0Email] Sent to ${params.email} (lead: ${params.lead_id})`);
}
