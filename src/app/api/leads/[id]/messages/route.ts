import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// GET: メッセージ履歴取得
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();

    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .eq("lead_id", id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: "取得に失敗しました" }, { status: 500 });
    }

    return NextResponse.json({ messages });
  } catch (err) {
    console.error("[API] Error:", err);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
