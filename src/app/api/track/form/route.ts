import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * フォーム行動トラッキング API
 *
 * POST /api/track/form
 * Body: { session_id, event, field, timestamp }
 *
 * event: "focus" | "blur" | "submit_attempt" | "validation_error" | "abandon"
 * field: フォームフィールド名
 *
 * 軽量に lead_events (lead_id なし) として保存し、
 * フォーム離脱分析に使用。
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { session_id, event, field, timestamp, metadata } = body;

    if (!session_id || !event) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // form_analytics テーブルがない場合は lead_events にフォールバック
    // MVP: lead_events にnull lead_id で保存はFKで制約があるため、
    // 専用のシンプルなINSERTを使う
    await supabase.from("form_analytics").insert({
      session_id,
      event,
      field: field || null,
      metadata: metadata || null,
      event_at: timestamp || new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch {
    // トラッキングはベストエフォート - 失敗してもユーザー体験に影響しない
    return NextResponse.json({ success: true });
  }
}
