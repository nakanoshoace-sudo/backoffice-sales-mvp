import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { emailSendSchema } from "@/lib/validations";
import { renderTemplate } from "@/lib/email/templates";
import { sendEmail } from "@/lib/email/resend";

// POST: メール送信
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = emailSendSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "無効なリクエストです" }, { status: 400 });
    }

    const { lead_id, template_key } = parsed.data;
    const supabase = createAdminClient();

    // リード情報取得
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("*")
      .eq("id", lead_id)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: "リードが見つかりません" }, { status: 404 });
    }

    // 配信停止チェック
    if (lead.opt_out) {
      return NextResponse.json({ error: "配信停止中のリードです" }, { status: 400 });
    }

    // 再送防止: 同じテンプレートが送信済みか確認
    const { data: existingMessage } = await supabase
      .from("messages")
      .select("id")
      .eq("lead_id", lead_id)
      .eq("template_key", template_key)
      .eq("status", "sent")
      .single();

    if (existingMessage) {
      return NextResponse.json(
        { error: "このテンプレートは既に送信済みです" },
        { status: 409 }
      );
    }

    // テンプレートレンダリング
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const rendered = renderTemplate(template_key, {
      person_name: lead.person_name,
      company_name: lead.company_name,
      booking_url: `${siteUrl}/book?lead_id=${lead_id}`,
      unsubscribe_url: `${siteUrl}/api/unsubscribe?lead_id=${lead_id}`,
    });

    if (!rendered) {
      return NextResponse.json({ error: "テンプレートが見つかりません" }, { status: 404 });
    }

    // メッセージレコード作成（queued状態）
    const { data: message, error: msgError } = await supabase
      .from("messages")
      .insert({
        lead_id,
        template_key,
        subject: rendered.subject,
        body_snapshot: rendered.body,
        status: "queued",
      })
      .select("id")
      .single();

    if (msgError || !message) {
      return NextResponse.json({ error: "メッセージの保存に失敗しました" }, { status: 500 });
    }

    // メール送信
    const result = await sendEmail({
      to: lead.email,
      subject: rendered.subject,
      text: rendered.body,
    });

    if (result.success) {
      // 送信成功
      await supabase
        .from("messages")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
          provider_message_id: result.messageId,
        })
        .eq("id", message.id);

      // last_contacted_at 更新
      await supabase
        .from("leads")
        .update({ last_contacted_at: new Date().toISOString() })
        .eq("id", lead_id);

      // イベント記録
      await supabase.from("lead_events").insert({
        lead_id,
        type: "email_sent",
        metadata: { template_key, message_id: message.id },
      });

      return NextResponse.json({ success: true, message_id: message.id });
    } else {
      // 送信失敗
      await supabase
        .from("messages")
        .update({
          status: "failed",
          error_message: result.error,
        })
        .eq("id", message.id);

      return NextResponse.json(
        { error: "メール送信に失敗しました", detail: result.error },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("[API] Email send error:", err);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
