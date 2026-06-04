import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * メールクリックトラッキング
 *
 * メール内リンクを /api/track/click?mid=<message_id>&lid=<lead_id>&url=<encoded_url>
 * に差し替えて使用。クリック時に:
 * 1. messages.click_count を +1
 * 2. lead_events に email_clicked を記録
 * 3. 元のURLにリダイレクト
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const messageId = searchParams.get("mid");
  const leadId = searchParams.get("lid");
  const targetUrl = searchParams.get("url");

  // URL が無い場合はトップにリダイレクト
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const redirectTo = targetUrl || siteUrl;

  if (messageId && leadId) {
    // 非同期で記録（リダイレクトをブロックしない）
    trackClick(messageId, leadId, targetUrl || "").catch((err) =>
      console.error("[Track] Click recording failed:", err)
    );
  }

  return NextResponse.redirect(redirectTo, { status: 302 });
}

async function trackClick(messageId: string, leadId: string, url: string): Promise<void> {
  const supabase = createAdminClient();

  // messages.click_count +1
  const { data: msg } = await supabase
    .from("messages")
    .select("click_count")
    .eq("id", messageId)
    .single();

  if (msg) {
    await supabase
      .from("messages")
      .update({
        click_count: (msg.click_count || 0) + 1,
        last_clicked_at: new Date().toISOString(),
      })
      .eq("id", messageId);
  }

  // lead_events に記録
  await supabase.from("lead_events").insert({
    lead_id: leadId,
    type: "email_clicked",
    metadata: { message_id: messageId, url },
  });

  // lead.score を +5 (初回クリックのみ)
  const { data: existingClicks } = await supabase
    .from("lead_events")
    .select("id")
    .eq("lead_id", leadId)
    .eq("type", "email_clicked")
    .limit(2);

  // 初回クリックの場合のみスコア加算
  if (existingClicks && existingClicks.length <= 1) {
    const { data: lead } = await supabase
      .from("leads")
      .select("score")
      .eq("id", leadId)
      .single();

    if (lead) {
      await supabase
        .from("leads")
        .update({ score: lead.score + 5 })
        .eq("id", leadId);
    }
  }
}
