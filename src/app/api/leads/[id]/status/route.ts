import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { statusUpdateSchema } from "@/lib/validations";

// PATCH: ステータス更新
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = statusUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "無効なステータスです" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 現在のステータスを取得
    const { data: current, error: fetchError } = await supabase
      .from("leads")
      .select("status")
      .eq("id", id)
      .single();

    if (fetchError || !current) {
      return NextResponse.json({ error: "リードが見つかりません" }, { status: 404 });
    }

    const fromStatus = current.status;
    const toStatus = parsed.data.status;

    // ステータス更新
    const updateData: Record<string, unknown> = { status: toStatus };
    if ((toStatus === "won" || toStatus === "lost") && parsed.data.reason) {
      updateData.close_reason = parsed.data.reason;
    }

    const { error: updateError } = await supabase
      .from("leads")
      .update(updateData)
      .eq("id", id);

    if (updateError) {
      return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
    }

    // パイプラインログ記録
    await supabase.from("pipeline_logs").insert({
      lead_id: id,
      from_status: fromStatus,
      to_status: toStatus,
      reason: parsed.data.reason || null,
    });

    // イベント記録
    await supabase.from("lead_events").insert({
      lead_id: id,
      type: "status_changed",
      metadata: { from: fromStatus, to: toStatus, reason: parsed.data.reason },
    });

    return NextResponse.json({ success: true, from: fromStatus, to: toStatus });
  } catch (err) {
    console.error("[API] Error:", err);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
