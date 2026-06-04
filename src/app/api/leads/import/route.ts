import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/auth";
import { calculateInitialScore } from "@/lib/scoring";
import { captureError } from "@/lib/error-reporting";

/**
 * CSV インポート API（改善版）
 *
 * CSV形式:
 * company_name,person_name,email,title,employee_size,pain_points,urgency,source,notes
 *
 * pain_points は "|" 区切り（例: "経理|請求|総務"）
 *
 * 改善点:
 * - メールアドレス重複チェック（skip / update 選択可能）
 * - メールアドレスの正規表現バリデーション
 * - 文字コード自動判定（BOM付きUTF-8対応）
 * - 空行スキップ
 */
export async function POST(request: Request) {
  const auth = await requireAuth();
  if (!auth.authenticated) return auth.response;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const duplicateHandling = (formData.get("duplicate_handling") as string) || "skip";

    if (!file) {
      return NextResponse.json({ error: "ファイルが指定されていません" }, { status: 400 });
    }

    let text = await file.text();

    // BOM除去
    if (text.charCodeAt(0) === 0xFEFF) {
      text = text.slice(1);
    }

    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length < 2) {
      return NextResponse.json({ error: "CSVにデータがありません" }, { status: 400 });
    }

    // ヘッダー解析
    const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().trim());
    const requiredHeaders = ["company_name", "person_name", "email"];
    const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));

    if (missingHeaders.length > 0) {
      return NextResponse.json(
        { error: `必須ヘッダーが不足: ${missingHeaders.join(", ")}` },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const results: { line: number; status: "created" | "skipped" | "updated" | "error"; email?: string; error?: string }[] = [];

    // 既存メールアドレスを一括取得（重複チェック用）
    const allEmails = lines.slice(1).map((line) => {
      const values = parseCSVLine(line);
      const emailIdx = headers.indexOf("email");
      return values[emailIdx]?.trim().toLowerCase() || "";
    }).filter(Boolean);

    const { data: existingLeads } = await supabase
      .from("leads")
      .select("id, email")
      .in("email", allEmails);

    const existingEmailMap = new Map<string, string>();
    if (existingLeads) {
      for (const lead of existingLeads) {
        existingEmailMap.set(lead.email.toLowerCase(), lead.id);
      }
    }

    // データ行を処理
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      const row: Record<string, string> = {};

      headers.forEach((header, idx) => {
        row[header] = values[idx] || "";
      });

      // バリデーション
      if (!row.company_name || !row.person_name || !row.email) {
        results.push({ line: i + 1, status: "error", error: "必須フィールドが空です" });
        continue;
      }

      // メールアドレスの正規表現バリデーション
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(row.email)) {
        results.push({ line: i + 1, status: "error", email: row.email, error: "メールアドレスが不正です" });
        continue;
      }

      const normalizedEmail = row.email.toLowerCase().trim();

      // 重複チェック
      const existingId = existingEmailMap.get(normalizedEmail);
      if (existingId) {
        if (duplicateHandling === "skip") {
          results.push({ line: i + 1, status: "skipped", email: normalizedEmail, error: "既に登録済み（スキップ）" });
          continue;
        } else if (duplicateHandling === "update") {
          // 既存リードを更新
          const painPoints = row.pain_points
            ? row.pain_points.split("|").map((p) => p.trim()).filter(Boolean)
            : undefined;

          const updateData: Record<string, unknown> = {};
          if (row.company_name) updateData.company_name = row.company_name;
          if (row.person_name) updateData.person_name = row.person_name;
          if (row.title) updateData.title = row.title;
          if (row.employee_size) updateData.employee_size = row.employee_size;
          if (painPoints && painPoints.length > 0) updateData.pain_points = painPoints;
          if (row.notes) updateData.notes = row.notes;

          await supabase
            .from("leads")
            .update(updateData)
            .eq("id", existingId);

          results.push({ line: i + 1, status: "updated", email: normalizedEmail });
          continue;
        }
        // duplicateHandling === "create" の場合はそのまま新規作成
      }

      // pain_points パース（"|" 区切り）
      const painPoints = row.pain_points
        ? row.pain_points.split("|").map((p) => p.trim()).filter(Boolean)
        : [];

      // urgency バリデーション
      const validUrgencies = ["urgent", "somewhat", "researching", "undecided"];
      const urgency = validUrgencies.includes(row.urgency) ? row.urgency : "undecided";

      const score = calculateInitialScore({
        urgency,
        employee_size: row.employee_size || undefined,
        pain_points: painPoints,
      });

      // リード作成
      const { data: lead, error: insertError } = await supabase
        .from("leads")
        .insert({
          company_name: row.company_name,
          person_name: row.person_name,
          email: normalizedEmail,
          title: row.title || null,
          employee_size: row.employee_size || null,
          pain_points: painPoints,
          urgency,
          source: row.source || "csv_import",
          status: "new",
          score,
          notes: row.notes || null,
        })
        .select("id")
        .single();

      if (insertError) {
        results.push({ line: i + 1, status: "error", email: normalizedEmail, error: insertError.message });
        continue;
      }

      // 新規作成時のみ existingEmailMap に追加（同一CSV内の重複防止）
      existingEmailMap.set(normalizedEmail, lead.id);

      // イベント記録
      await supabase.from("lead_events").insert({
        lead_id: lead.id,
        type: "form_submitted",
        metadata: { source: "csv_import", imported_at: new Date().toISOString() },
      });

      results.push({ line: i + 1, status: "created", email: normalizedEmail });
    }

    const createdCount = results.filter((r) => r.status === "created").length;
    const skippedCount = results.filter((r) => r.status === "skipped").length;
    const updatedCount = results.filter((r) => r.status === "updated").length;
    const errorCount = results.filter((r) => r.status === "error").length;

    return NextResponse.json({
      success: true,
      total: results.length,
      created: createdCount,
      skipped: skippedCount,
      updated: updatedCount,
      errors: errorCount,
      details: results.filter((r) => r.status === "error" || r.status === "skipped").slice(0, 30),
    });
  } catch (err) {
    captureError(err, { source: "api.leads.import" });
    return NextResponse.json({ error: "インポートに失敗しました" }, { status: 500 });
  }
}

/** 簡易CSVパーサー（ダブルクォート対応） */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}
