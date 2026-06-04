import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * 配信停止 API
 * GET: lead_id パラメータで opt_out を true に設定
 * POST: JSON body で lead_id を受け取り opt_out を true に設定
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const leadId = searchParams.get("lead_id");
  const token = searchParams.get("token");

  if (!leadId) {
    return NextResponse.json({ error: "lead_id is required" }, { status: 400 });
  }

  const result = await processUnsubscribe(leadId, token);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  // 配信停止完了ページへリダイレクト
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return NextResponse.redirect(`${siteUrl}/unsubscribe?success=true`);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lead_id, token } = body;

    if (!lead_id) {
      return NextResponse.json({ error: "lead_id is required" }, { status: 400 });
    }

    const result = await processUnsubscribe(lead_id, token);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ success: true, message: "配信を停止しました" });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

async function processUnsubscribe(
  leadId: string,
  _token?: string | null
): Promise<{ success: boolean; error?: string; status?: number }> {
  const supabase = createAdminClient();

  // リード存在確認
  const { data: lead, error: fetchError } = await supabase
    .from("leads")
    .select("id, opt_out")
    .eq("id", leadId)
    .single();

  if (fetchError || !lead) {
    return { success: false, error: "リードが見つかりません", status: 404 };
  }

  if (lead.opt_out) {
    return { success: true }; // 既に停止済み
  }

  // opt_out を true に更新
  const { error: updateError } = await supabase
    .from("leads")
    .update({ opt_out: true })
    .eq("id", leadId);

  if (updateError) {
    console.error("[Unsubscribe] Update failed:", updateError);
    return { success: false, error: "更新に失敗しました", status: 500 };
  }

  // イベント記録
  await supabase.from("lead_events").insert({
    lead_id: leadId,
    type: "unsubscribed",
    metadata: { method: "link" },
  });

  return { success: true };
}
