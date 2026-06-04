import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/auth";

/**
 * テンプレート別メール成果統計
 * GET /api/dashboard/email-stats
 */
export async function GET() {
  const auth = await requireAuth();
  if (!auth.authenticated) return auth.response;

  try {
    const supabase = createAdminClient();

    // 全送信済みメッセージ取得
    const { data: messages } = await supabase
      .from("messages")
      .select("template_key, status, click_count, lead_id")
      .eq("status", "sent");

    if (!messages || messages.length === 0) {
      return NextResponse.json({ stats: [] });
    }

    // テンプレート別に集計
    const templateMap = new Map<string, {
      sent: number;
      clicked: number;
      totalClicks: number;
      leadIds: Set<string>;
    }>();

    for (const msg of messages) {
      const key = msg.template_key;
      if (!templateMap.has(key)) {
        templateMap.set(key, { sent: 0, clicked: 0, totalClicks: 0, leadIds: new Set() });
      }
      const entry = templateMap.get(key)!;
      entry.sent++;
      if ((msg.click_count || 0) > 0) {
        entry.clicked++;
        entry.totalClicks += msg.click_count;
      }
      entry.leadIds.add(msg.lead_id);
    }

    // booked以降のリードID取得
    const { data: bookedLeads } = await supabase
      .from("leads")
      .select("id")
      .in("status", ["booked", "proposal", "won"]);

    const bookedLeadIds = new Set(bookedLeads?.map((l) => l.id) || []);

    // 統計をまとめる
    const stats = Array.from(templateMap.entries()).map(([key, entry]) => {
      const bookedFromTemplate = Array.from(entry.leadIds).filter((id) => bookedLeadIds.has(id)).length;
      return {
        template_key: key,
        sent: entry.sent,
        clicked: entry.clicked,
        click_rate: entry.sent > 0 ? Math.round((entry.clicked / entry.sent) * 100) : 0,
        total_clicks: entry.totalClicks,
        booked_contribution: bookedFromTemplate,
        booking_rate: entry.leadIds.size > 0 ? Math.round((bookedFromTemplate / entry.leadIds.size) * 100) : 0,
      };
    });

    // day順にソート
    stats.sort((a, b) => {
      const dayA = parseInt(a.template_key.match(/day_(\d+)/)?.[1] || "0");
      const dayB = parseInt(b.template_key.match(/day_(\d+)/)?.[1] || "0");
      return dayA - dayB;
    });

    return NextResponse.json({ stats });
  } catch (err) {
    console.error("[API] Email stats error:", err);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
