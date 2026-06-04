import { sendEmail } from "@/lib/email/resend";

interface LeadNotificationData {
  company_name: string;
  person_name: string;
  email: string;
  urgency: string;
  pain_points: string[];
  score: number;
}

/**
 * 新規リード通知を送信
 * NOTIFICATION_EMAIL が設定されている場合はメール通知
 * SLACK_WEBHOOK_URL が設定されている場合はSlack通知
 */
export async function notifyNewLead(lead: LeadNotificationData): Promise<void> {
  const promises: Promise<void>[] = [];

  // メール通知
  const notificationEmail = process.env.NOTIFICATION_EMAIL;
  if (notificationEmail) {
    promises.push(sendEmailNotification(notificationEmail, lead));
  }

  // Slack通知
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (slackWebhookUrl) {
    promises.push(sendSlackNotification(slackWebhookUrl, lead));
  }

  await Promise.allSettled(promises);
}

async function sendEmailNotification(to: string, lead: LeadNotificationData): Promise<void> {
  const urgencyMap: Record<string, string> = {
    urgent: "🔴 すぐにでも",
    somewhat: "🟡 1〜3ヶ月",
    researching: "🔵 半年以内",
    undecided: "⚪ 未定",
  };

  await sendEmail({
    to,
    subject: `【新規リード】${lead.company_name} - ${lead.person_name}様 (スコア: ${lead.score})`,
    text: `新しいリードが登録されました。

━━━━━━━━━━━━━━━━━━━━
会社名: ${lead.company_name}
氏名: ${lead.person_name}
メール: ${lead.email}
緊急度: ${urgencyMap[lead.urgency] || lead.urgency}
課題: ${lead.pain_points.join(", ")}
スコア: ${lead.score}
━━━━━━━━━━━━━━━━━━━━

管理画面で確認: ${process.env.NEXT_PUBLIC_SITE_URL}/admin/leads
`,
  });
}

async function sendSlackNotification(webhookUrl: string, lead: LeadNotificationData): Promise<void> {
  const urgencyMap: Record<string, string> = {
    urgent: "🔴 すぐにでも",
    somewhat: "🟡 1〜3ヶ月",
    researching: "🔵 半年以内",
    undecided: "⚪ 未定",
  };

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `📥 *新規リード登録*`,
        blocks: [
          {
            type: "header",
            text: { type: "plain_text", text: "📥 新規リード登録" },
          },
          {
            type: "section",
            fields: [
              { type: "mrkdwn", text: `*会社名:*\n${lead.company_name}` },
              { type: "mrkdwn", text: `*氏名:*\n${lead.person_name}` },
              { type: "mrkdwn", text: `*緊急度:*\n${urgencyMap[lead.urgency] || lead.urgency}` },
              { type: "mrkdwn", text: `*スコア:*\n${lead.score}` },
            ],
          },
          {
            type: "section",
            text: { type: "mrkdwn", text: `*課題:* ${lead.pain_points.join(", ")}` },
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: { type: "plain_text", text: "管理画面で確認" },
                url: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/leads`,
              },
            ],
          },
        ],
      }),
    });
  } catch (err) {
    console.error("[Notification] Slack notification failed:", err);
  }
}
