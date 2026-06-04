import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/auth";

// GET: ダッシュボードデータ（認証必須）
export async function GET() {
  const auth = await requireAuth();
  if (!auth.authenticated) return auth.response;

  try {
    const supabase = createAdminClient();

    // 総リード数
    const { count: totalLeads } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true });

    // 今週の新規リード
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const { count: newLeadsThisWeek } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .gte("created_at", oneWeekAgo.toISOString());

    // ステータス別件数
    const { data: allLeads } = await supabase
      .from("leads")
      .select("status, source, opt_out, created_at");
    const statusBreakdown: Record<string, number> = {};
    const sourceBreakdown: Record<string, number> = {};
    let optOutCount = 0;

    // source別ファネル用
    const sourceStats = new Map<string, { total: number; booked: number; won: number }>();

    if (allLeads) {
      for (const lead of allLeads) {
        statusBreakdown[lead.status] = (statusBreakdown[lead.status] || 0) + 1;
        const src = lead.source || "direct";
        sourceBreakdown[src] = (sourceBreakdown[src] || 0) + 1;
        if (lead.opt_out) optOutCount++;

        // source別集計
        if (!sourceStats.has(src)) sourceStats.set(src, { total: 0, booked: 0, won: 0 });
        const ss = sourceStats.get(src)!;
        ss.total++;
        if (["booked", "proposal", "won"].includes(lead.status)) ss.booked++;
        if (lead.status === "won") ss.won++;
      }
    }

    // sourceConversion 配列に変換
    const sourceConversion = Array.from(sourceStats.entries())
      .map(([source, s]) => ({
        source,
        total: s.total,
        booked: s.booked,
        won: s.won,
        booking_rate: s.total > 0 ? Math.round((s.booked / s.total) * 100) : 0,
        won_rate: s.total > 0 ? Math.round((s.won / s.total) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total);

    // 予約数
    const { count: bookingsCount } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true });

    // won件数
    const { count: wonCount } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("status", "won");

    // メール送信統計
    const { count: totalEmailsSent } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("status", "sent");

    const { count: totalEmailsFailed } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("status", "failed");

    // クリック統計
    const { data: clickStats } = await supabase
      .from("messages")
      .select("click_count")
      .eq("status", "sent");

    const totalClicks = clickStats?.reduce((sum, m) => sum + (m.click_count || 0), 0) || 0;
    const messagesWithClicks = clickStats?.filter((m) => (m.click_count || 0) > 0).length || 0;

    // クリック→予約貢献（email_clicked イベントのあるリードのうち booked 以降のもの）
    const { count: clickToBookedCount } = await supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .in("status", ["booked", "proposal", "won"])
      .in("id", 
        (await supabase
          .from("lead_events")
          .select("lead_id")
          .eq("type", "email_clicked")
        ).data?.map((e) => e.lead_id) || []
      );

    // ファネル指標
    const total = totalLeads || 0;
    const booked = (statusBreakdown["booked"] || 0) + (statusBreakdown["proposal"] || 0) + (statusBreakdown["won"] || 0);
    const won = statusBreakdown["won"] || 0;

    const funnel = {
      form_to_booked_rate: total > 0 ? Math.round((booked / total) * 100) : 0,
      booked_to_won_rate: booked > 0 ? Math.round((won / booked) * 100) : 0,
      overall_conversion_rate: total > 0 ? Math.round((won / total) * 100) : 0,
      opt_out_rate: total > 0 ? Math.round((optOutCount / total) * 100) : 0,
      email_success_rate:
        (totalEmailsSent || 0) + (totalEmailsFailed || 0) > 0
          ? Math.round(((totalEmailsSent || 0) / ((totalEmailsSent || 0) + (totalEmailsFailed || 0))) * 100)
          : 100,
      email_click_rate:
        (totalEmailsSent || 0) > 0
          ? Math.round((messagesWithClicks / (totalEmailsSent || 1)) * 100)
          : 0,
      click_to_booked: clickToBookedCount || 0,
    };

    // 最近のイベント
    const { data: recentEvents } = await supabase
      .from("lead_events")
      .select("*, leads(person_name, company_name)")
      .order("created_at", { ascending: false })
      .limit(10);

    // 要対応リード（new で 3日以上経過）
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const { data: leadsNeedingAttention } = await supabase
      .from("leads")
      .select("id, company_name, person_name, status, score, created_at")
      .eq("status", "new")
      .lte("created_at", threeDaysAgo.toISOString())
      .order("score", { ascending: false })
      .limit(10);

    return NextResponse.json({
      totalLeads: total,
      newLeadsThisWeek: newLeadsThisWeek || 0,
      statusBreakdown,
      sourceBreakdown,
      sourceConversion,
      bookingsCount: bookingsCount || 0,
      wonCount: wonCount || 0,
      optOutCount,
      totalEmailsSent: totalEmailsSent || 0,
      totalEmailsFailed: totalEmailsFailed || 0,
      totalClicks,
      funnel,
      recentEvents: recentEvents || [],
      leadsNeedingAttention: leadsNeedingAttention || [],
    });
  } catch (err) {
    console.error("[API] Dashboard error:", err);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
