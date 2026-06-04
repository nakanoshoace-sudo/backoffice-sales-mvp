import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import crypto from "crypto";

/**
 * Calendly Webhook エンドポイント
 *
 * Calendly から invitee.created イベントを受信し:
 * 1. 署名検証（CALENDLY_WEBHOOK_SECRET 設定時）
 * 2. メールアドレスでリードを検索
 * 3. booking レコード作成
 * 4. lead ステータスを booked に更新
 *
 * Calendly Webhook 設定:
 *   URL: https://your-domain.com/api/webhooks/calendly
 *   Events: invitee.created
 *   Signing key: CALENDLY_WEBHOOK_SECRET
 */
export async function POST(request: Request) {
  try {
    // リクエストボディを取得（署名検証に使うため先に取得）
    const rawBody = await request.text();

    // Webhook署名検証
    const webhookSecret = process.env.CALENDLY_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signatureHeader = request.headers.get("calendly-webhook-signature");
      if (!signatureHeader) {
        return NextResponse.json({ error: "Missing signature" }, { status: 401 });
      }

      const isValid = verifyCalendlySignature(rawBody, signatureHeader, webhookSecret);
      if (!isValid) {
        console.error("[Webhook] Calendly signature verification failed");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);

    // Calendly イベントタイプ確認
    const event = payload.event;
    if (event !== "invitee.created") {
      return NextResponse.json({ message: "Event ignored" }, { status: 200 });
    }

    const inviteePayload = payload.payload;
    const inviteeEmail = inviteePayload?.email;
    const inviteeName = inviteePayload?.name;
    const eventStartTime = inviteePayload?.scheduled_event?.start_time;

    if (!inviteeEmail) {
      return NextResponse.json({ error: "No email in payload" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // メールアドレスでリードを検索
    const { data: lead } = await supabase
      .from("leads")
      .select("id, status, score")
      .eq("email", inviteeEmail)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!lead) {
      // リードが見つからない場合、新規リード作成
      const { data: newLead } = await supabase
        .from("leads")
        .insert({
          company_name: inviteeName || "不明",
          person_name: inviteeName || "不明",
          email: inviteeEmail,
          status: "booked",
          score: 30,
          source: "calendly",
        })
        .select("id")
        .single();

      if (newLead) {
        await supabase.from("bookings").insert({
          lead_id: newLead.id,
          booking_source: "calendly",
          meeting_at: eventStartTime || null,
          note: `Calendly経由: ${inviteeName || ""}`,
        });

        await supabase.from("lead_events").insert({
          lead_id: newLead.id,
          type: "booking_created",
          metadata: { source: "calendly_webhook", invitee_email: inviteeEmail },
        });
      }

      return NextResponse.json({ success: true, action: "new_lead_created" });
    }

    // 既存リードに予約追加
    await supabase.from("bookings").insert({
      lead_id: lead.id,
      booking_source: "calendly",
      meeting_at: eventStartTime || null,
      note: `Calendly経由: ${inviteeName || ""}`,
    });

    // ステータスを booked に更新（booked/proposal/won の場合はスキップ）
    if (lead.status !== "booked" && lead.status !== "proposal" && lead.status !== "won") {
      const fromStatus = lead.status;

      await supabase
        .from("leads")
        .update({
          status: "booked",
          score: lead.score + 20,
        })
        .eq("id", lead.id);

      await supabase.from("pipeline_logs").insert({
        lead_id: lead.id,
        from_status: fromStatus,
        to_status: "booked",
        reason: "Calendly webhook - 予約完了",
      });
    }

    // イベント記録
    await supabase.from("lead_events").insert({
      lead_id: lead.id,
      type: "booking_created",
      metadata: {
        source: "calendly_webhook",
        invitee_email: inviteeEmail,
        meeting_at: eventStartTime,
      },
    });

    return NextResponse.json({ success: true, lead_id: lead.id });
  } catch (err) {
    console.error("[Webhook] Calendly error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

/**
 * Calendly Webhook 署名検証
 * Calendly の署名形式: "t=<timestamp>,v1=<signature>"
 * 検証: HMAC-SHA256(timestamp + "." + body, secret)
 */
function verifyCalendlySignature(
  body: string,
  signatureHeader: string,
  secret: string
): boolean {
  try {
    // Parse "t=timestamp,v1=signature" format
    const parts = signatureHeader.split(",");
    const timestampPart = parts.find((p) => p.startsWith("t="));
    const signaturePart = parts.find((p) => p.startsWith("v1="));

    if (!timestampPart || !signaturePart) {
      return false;
    }

    const timestamp = timestampPart.slice(2);
    const receivedSignature = signaturePart.slice(3);

    // Replay attack 防止: 5分以内のタイムスタンプか確認
    const timestampMs = parseInt(timestamp, 10) * 1000;
    const now = Date.now();
    const tolerance = 5 * 60 * 1000; // 5分

    if (Math.abs(now - timestampMs) > tolerance) {
      console.error("[Webhook] Calendly timestamp too old:", { timestamp, now });
      return false;
    }

    // 署名計算: HMAC-SHA256(timestamp.body, secret)
    const payload = `${timestamp}.${body}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    // タイミング攻撃防止のための比較
    return crypto.timingSafeEqual(
      Buffer.from(receivedSignature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
  } catch (err) {
    console.error("[Webhook] Signature verification error:", err);
    return false;
  }
}
