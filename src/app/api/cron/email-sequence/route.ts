import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireCronAuth } from "@/lib/auth";
import { EMAIL_TEMPLATES } from "@/lib/email/templates";
import { sendEmail } from "@/lib/email/resend";
import { wrapLinksWithTracking } from "@/lib/email/tracking";
import { captureError, logCronResult } from "@/lib/error-reporting";

/**
 * Cron: メールシーケンス自動送信
 * Vercel Cron で毎日1回実行（vercel.json: 毎日 AM9:00 JST）
 *
 * ロジック:
 * 1. status が new/contacted/engaged のリードを取得
 * 2. opt_out = true は除外
 * 3. 各リードに対して、作成日からの経過日数に応じたテンプレートを送信
 * 4. 既に送信済みのテンプレートはスキップ
 * 5. 直近24時間以内に送信済みのリードはスキップ（乱発防止）
 */
export async function GET(request: Request) {
  // Cron認証チェック
  if (!requireCronAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const results: { lead_id: string; template_key: string; status: string }[] = [];

  try {
    // 対象リード取得: new, contacted, engaged で opt_out=false
    const { data: leads, error: leadsError } = await supabase
      .from("leads")
      .select("id, company_name, person_name, email, status, opt_out, created_at")
      .in("status", ["new", "contacted", "engaged"])
      .eq("opt_out", false);

    if (leadsError || !leads) {
      console.error("[Cron] Failed to fetch leads:", leadsError);
      return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
    }

    const now = new Date();

    // 全テンプレートを対象 (Day 0, 2, 5, 8, 12, 16, 21)
    const targetTemplates = EMAIL_TEMPLATES;

    for (const lead of leads) {
      // opt_out の二重チェック（念のため）
      if (lead.opt_out) continue;

      const createdAt = new Date(lead.created_at);
      const daysSinceCreation = Math.floor(
        (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      // 直近24時間以内に送信済みか確認
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const { data: recentMessages } = await supabase
        .from("messages")
        .select("id")
        .eq("lead_id", lead.id)
        .eq("status", "sent")
        .gte("sent_at", oneDayAgo.toISOString())
        .limit(1);

      if (recentMessages && recentMessages.length > 0) {
        continue; // 24時間以内に送信済み → スキップ
      }

      // 該当するテンプレートを確認（日数が近い順に）
      for (const template of targetTemplates) {
        if (daysSinceCreation < template.day) continue; // まだ日数が足りない

        // 既に送信済みか確認
        const { data: existingMsg } = await supabase
          .from("messages")
          .select("id")
          .eq("lead_id", lead.id)
          .eq("template_key", template.key)
          .eq("status", "sent")
          .limit(1);

        if (existingMsg && existingMsg.length > 0) continue; // 送信済み

        // テンプレートをレンダリング
        const body = template.body({
          person_name: lead.person_name,
          company_name: lead.company_name,
          booking_url: `${siteUrl}/book?lead_id=${lead.id}`,
          unsubscribe_url: `${siteUrl}/api/unsubscribe?lead_id=${lead.id}`,
        });

        // メッセージレコード作成
        const { data: message } = await supabase
          .from("messages")
          .insert({
            lead_id: lead.id,
            template_key: template.key,
            subject: template.subject,
            body_snapshot: body,
            status: "queued",
          })
          .select("id")
          .single();

        if (!message) continue;

        // トラッキングURL差し込み
        const trackedBody = wrapLinksWithTracking(body, lead.id, message.id);

        // メール送信（leadId を渡して List-Unsubscribe ヘッダー付与）
        const result = await sendEmail({
          to: lead.email,
          subject: template.subject,
          text: trackedBody,
          leadId: lead.id,
        });

        if (result.success) {
          await supabase
            .from("messages")
            .update({
              status: "sent",
              sent_at: new Date().toISOString(),
              provider_message_id: result.messageId,
            })
            .eq("id", message.id);

          await supabase
            .from("leads")
            .update({ last_contacted_at: new Date().toISOString() })
            .eq("id", lead.id);

          await supabase.from("lead_events").insert({
            lead_id: lead.id,
            type: "email_sent",
            metadata: { template_key: template.key, message_id: message.id, auto: true },
          });

          results.push({ lead_id: lead.id, template_key: template.key, status: "sent" });
        } else {
          await supabase
            .from("messages")
            .update({ status: "failed", error_message: result.error })
            .eq("id", message.id);

          captureError(new Error(`Email send failed: ${result.error}`), {
            source: "cron.email-sequence",
            leadId: lead.id,
            extra: { template_key: template.key },
          });

          results.push({ lead_id: lead.id, template_key: template.key, status: "failed" });
        }

        break; // 1リードにつき1通/回のみ送信
      }
    }

    const cronResult = {
      success: true,
      processed: leads.length,
      sent: results.filter((r) => r.status === "sent").length,
      failed: results.filter((r) => r.status === "failed").length,
    };

    logCronResult("email-sequence", cronResult);

    return NextResponse.json({
      ...cronResult,
      details: results,
    });
  } catch (err) {
    captureError(err, { source: "cron.email-sequence" });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
