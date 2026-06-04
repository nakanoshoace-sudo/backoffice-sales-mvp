import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/auth";

/**
 * CSVエクスポート API（認証必須）
 *
 * GET /api/leads/export?status=new&format=csv
 *
 * ステータスフィルタ任意。全リードを CSV としてダウンロード。
 */
export async function GET(request: Request) {
  const auth = await requireAuth();
  if (!auth.authenticated) return auth.response;

  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = supabase
      .from("leads")
      .select("id, company_name, person_name, email, title, employee_size, pain_points, urgency, source, campaign, status, score, opt_out, notes, created_at, last_contacted_at, privacy_agreed_at")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data: leads, error } = await query;

    if (error) {
      return NextResponse.json({ error: "エクスポートに失敗しました" }, { status: 500 });
    }

    if (!leads || leads.length === 0) {
      return NextResponse.json({ error: "エクスポート対象のデータがありません" }, { status: 404 });
    }

    // CSV生成
    const headers = [
      "id",
      "company_name",
      "person_name",
      "email",
      "title",
      "employee_size",
      "pain_points",
      "urgency",
      "source",
      "campaign",
      "status",
      "score",
      "opt_out",
      "notes",
      "created_at",
      "last_contacted_at",
      "privacy_agreed_at",
    ];

    const csvLines: string[] = [headers.join(",")];

    for (const lead of leads) {
      const row = headers.map((h) => {
        const value = (lead as Record<string, unknown>)[h];
        if (value === null || value === undefined) return "";
        if (Array.isArray(value)) return `"${value.join("|")}"`;
        const str = String(value);
        // CSVエスケープ
        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      });
      csvLines.push(row.join(","));
    }

    const csv = "\uFEFF" + csvLines.join("\n"); // BOM付きUTF-8

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="leads_export_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (err) {
    console.error("[API] Export error:", err);
    return NextResponse.json({ error: "エクスポートに失敗しました" }, { status: 500 });
  }
}
